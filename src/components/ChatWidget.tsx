import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ApiResponse {
  response: string;
}

interface ChatWidgetProps {
  apiUrl?: string;
  customerId?: string;
  theme?: {
    primaryColor?: string;
  };
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiUrl = '/api/chat',
  customerId,
  theme
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (!savedMessages) return [];
    const parsed = JSON.parse(savedMessages) as (Omit<Message, 'timestamp'> & { timestamp: string })[];
    return parsed.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  });
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    const messagesToSave = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    }));
    localStorage.setItem('chatMessages', JSON.stringify(messagesToSave));
  }, [messages]);

  useEffect(() => {
    if (theme?.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    }
  }, [theme]);

  const toggleChat = () => {
    if (!isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "Hello, how can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Customer-ID': customerId ?? '',
        },
        body: JSON.stringify({
          message: inputValue,
          customerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json() as ApiResponse;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response ?? 'Sorry, I could not process your message.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error sending your message. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {!isOpen && (
        <button className={styles.chatButton} onClick={toggleChat}>
          Chat with us
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Chat with us</h3>
            <button className={styles.closeButton} onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className={styles.messagesContainer} ref={messagesContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender === 'user' ? styles.userMessage : styles.botMessage
                }`}
              >
                {message.sender === 'bot' && (
                  <div className={styles.messageIcon}>👨‍💼</div>
                )}
                <div className={styles.messageContent}>
                  {message.content}
                  <div className={styles.messageTimestamp}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendButton}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};