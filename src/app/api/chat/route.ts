import { NextResponse } from 'next/server';
import { z } from 'zod';
import Together from 'together-ai';
import { PrismaClient } from '@prisma/client';

type PrismaClientWithModels = PrismaClient & {
  conversation: {
    findUnique: (args: {
      where: { id: string };
      include: { messages: true };
    }) => Promise<{
      id: string;
      customerDomain: string;
      messages: { content: string; sender: string }[];
    } | null>;
    create: (args: {
      data: { customerDomain: string };
      include: { messages: true };
    }) => Promise<{
      id: string;
      customerDomain: string;
      messages: { content: string; sender: string }[];
    }>;
  };
  message: {
    create: (args: { data: { content: string; sender: 'user' | 'bot'; conversationId: string } }) => Promise<{ id: string }>;
  };
};

// Initialize Prisma client as a singleton
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClientWithModels };
const prisma = new PrismaClient() as PrismaClientWithModels;
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// List of allowed dealership domains
const ALLOWED_DOMAINS = [
  'toyota.com',
  'honda.com',
  'ford.com',
  'bmw.com',
  'mercedes.com',
  'localhost'
] as const;

type AllowedDomain = typeof ALLOWED_DOMAINS[number];

// Define the request schema
const chatRequestSchema = z.object({
  message: z.string().min(1),
  customerDomain: z.string().optional(),
  conversationId: z.string().optional().nullable(),
});

type ChatRequest = z.infer<typeof chatRequestSchema>;

// Initialize Together AI client
const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error('TOGETHER_API_KEY is not configured');
}
const together = new Together({
  apiKey,
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as ChatRequest;
    const { message, customerDomain, conversationId } = chatRequestSchema.parse(body);

    // Validate domain
    if (!customerDomain || !ALLOWED_DOMAINS.includes(customerDomain as AllowedDomain)) {
      return NextResponse.json(
        { error: 'Unauthorized domain. Please sign up for our service to use this feature.' },
        { status: 401 }
      );
    }

    const finalCustomerDomain = customerDomain as AllowedDomain;

    // Get or create conversation
    const conversation = conversationId
      ? await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: true }
        })
      : await prisma.conversation.create({
          data: {
            customerDomain: finalCustomerDomain,
          },
          include: { messages: true }
        });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create or find conversation' },
        { status: 400 }
      );
    }

    // Store user message
    await prisma.message.create({
      data: {
        content: message,
        sender: 'user',
        conversationId: conversation.id,
      },
    });

    // Prepare conversation history for AI context
    const conversationHistory = conversation.messages
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'system' as 'user' | 'system',
        content: msg.content
      }))
      .slice(-10); // Get last 10 messages for context

    // TODO: see if we have a knowledge cache of the customerDomain, if not scrape the domain for data and cache the information for next time

    // Get AI response
    const response = await together.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V3',
      messages: [
        {
          role: 'system',
          content: `You are a friendly and helpful customer support assistant for ${finalCustomerDomain}. Keep your responses short, precise, and to the point.

          Guidelines:
          - Keep responses under 2-3 sentences
          - Be direct and clear
          - Use bullet points for multiple items
          - Avoid unnecessary explanations
          - If you need more information, ask one specific question
          - Do not use any special text formatting (no **, *, _, etc.)
          - Write in plain text only

          For service bookings:
          - You can show available timeslots first before asking for customer info
          - You have to collect ALL of this information before confirming any booking:
            * Customer's name
            * Vehicle make and model
            * Contact phone number
            * Service type needed
          - If any information is missing, ask for it before confirming
          - For cancellations/rescheduling, verify customer info first

          You can assist with:
          - Booking appointments (must collect all required info)
          - Canceling or rescheduling appointments (must verify info first)
          - Checking vehicle status
          - Answering questions about available vehicles
          - General dealership inquiries

          If you cannot help with a request or if the question is not automotive-related:
          1. First state: "I apologize, but I'm unable to assist with this specific request."
          2. Then ask: "Would you like to leave your contact information so an agent can reach out to help you?"
          3. If they agree, collect:
            * Their name
            * Phone number
            * Best time to contact
            * Brief description of their needs`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const botResponse = response.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.';

    // Store bot response
    await prisma.message.create({
      data: {
        content: botResponse,
        sender: 'bot',
        conversationId: conversation.id,
      },
    });

    return NextResponse.json({
      response: botResponse,
      conversationId: conversation.id
    });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}