# Toma Chat

A customer support chat widget for automotive dealerships, built with Next.js, Prisma, and Together AI. The widget provides intelligent customer service with AI-powered responses and seamless handoff to human agents when needed.

## Features

- Real-time chat interface with typing indicators
- Conversation history tracking and context awareness
- Structured customer information collection for service bookings
- Intelligent AI responses with Together AI
- Seamless fallback to human agents
- Domain-based security

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Together AI API key

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/bnguyen212/toma-chat-support.git
   cd toma-chat-support
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/toma_chat"
   TOGETHER_API_KEY="your-together-ai-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   # Terminal 1: Run Next.js development server
   npm run dev
   # or
   yarn dev

   # Terminal 2: Run widget watcher for development
   npm run watch:widget
   # or
   yarn watch:widget
   ```

6. **Build for production**
   ```bash
   # Build the Next.js app and widget bundle
   npm run build
   # or
   yarn build

   # The build process will:
   # 1. Build the Next.js application
   # 2. Generate the widget bundle in public/chat-widget.js
   # 3. Generate the widget styles in public/chat-widget.css
   ```

## Usage

**Embed the chat widget**
   Add the following script to your website:
   ```html
   <script src="<host>/chat-widget.js"></script>
   <script>
     TomaChat.init({
       customerDomain: 'your-dealership-domain.com'  // Must be an authorized domain
     });
   </script>
   ```

## Development

- **Frontend**:
  - Next.js with TypeScript
  - React for UI components
  - CSS Modules for styling
- **Backend**:
  - Next.js API routes
  - Prisma ORM for database operations
  - Together AI for natural language processing
- **Database**:
  - PostgreSQL
  - Conversation and message history storage
- **Security**:
  - Domain-based authentication
  - Secure API endpoints
  - Environment variable protection

## Project Structure

```
toma-chat/
├── prisma/              # Database schema and migrations
├── public/             # Static assets and widget bundle
├── src/
│   ├── app/           # Next.js app directory
│   │   └── api/       # API routes for chat and authentication
│   ├── components/    # React components
│   │   └── ChatWidget.tsx  # Main chat interface
│   └── widget/        # Widget initialization and bundling
├── .env               # Environment variables
└── package.json       # Project dependencies
```
