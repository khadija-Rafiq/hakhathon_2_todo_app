'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { CheckCircle2, ListTodo, Sparkles, X } from 'lucide-react';
import { getApiUrl } from '@/lib/utils';

interface ChatInterfaceProps {
  userId: string;
  token: string;
  onClose?: () => void; // Optional close function
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  parts?: Array<{ type: 'text'; text: string }>;
}

// Define the expected props for child components
interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

interface ChatHeaderProps {}

export function ChatInterface({ userId, token, onClose }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Clear any previous errors
    setError(null);

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    // Add placeholder assistant message
    const tempAiMessage: Message = {
      id: `ai-temp-${Date.now()}`,
      content: '',
      role: 'assistant'
    };
    setMessages(prev => [...prev, tempAiMessage]);

    try {
      // Send message to backend
      const response = await fetch(`${getApiUrl()}/api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          message: userInput
        })
      });

      if (!response.ok) {
        // Try to get error details from response body
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Update conversation ID if it's a new conversation
      if (data.data?.conversation_id && !conversationId) {
        setConversationId(data.data.conversation_id);
      }

      // Replace placeholder with actual AI response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempAiMessage.id 
            ? { ...msg, content: data.data?.response || 'Sorry, I encountered an error processing your request.' }
            : msg
        )
      );
    } catch (error) {
      console.error('Chat error:', error);

      // Determine the appropriate error message based on the error
      let errorMessage = 'Sorry, there was an error processing your request. Please try again.';
      let userError = 'Connection error. Please check your internet and try again.';

      // Check if it's a network error or specific API error
      if (error instanceof Error) {
        const errorMsg = error.message;

        if (errorMsg.includes('500')) {
          // Check for specific configuration errors
          if (errorMsg.includes('OPENROUTER_API_KEY') || errorMsg.includes('AI service is not configured')) {
            errorMessage = 'Sorry, the OpenRouter AI service is not properly configured. Please contact the administrator to set up the required API keys.';
            userError = 'OpenRouter AI service configuration error. Please contact the administrator.';
          } else {
            errorMessage = 'Sorry, there was an issue with the OpenRouter AI service. The system may not be properly configured.';
            userError = 'OpenRouter AI service configuration error. Please contact the administrator.';
          }
        } else if (errorMsg.includes('401') || errorMsg.includes('403')) {
          errorMessage = 'Sorry, you are not authorized to access this service.';
          userError = 'Authentication error. Please log in again.';
        } else {
          // Use the actual error message from the server if available
          errorMessage = `Sorry, there was an error: ${errorMsg}`;
          userError = `Error: ${errorMsg}`;
        }
      }

      // Replace placeholder with error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempAiMessage.id
            ? {
                ...msg,
                content: errorMessage
              }
            : msg
        )
      );

      setError(userError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white relative">
      <ChatHeader />
      
      {/* X Close Button - Top Right */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2.5 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 border border-gray-200 group"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </button>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fadeIn">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Welcome to Todo Assistant
              </h2>
              
              <p className="text-gray-500 mb-8 max-w-md">
                I can help you manage your tasks using natural language. Try asking me something!
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                <button
                  onClick={() => setInput('Show me all my pending tasks')}
                  className="group flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <ListTodo className="w-5 h-5 text-blue-600 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">View Tasks</div>
                    <div className="text-xs text-gray-500 mt-0.5">Show me all my pending tasks</div>
                  </div>
                </button>

                <button
                  onClick={() => setInput('Create a task to finish the project report by Friday')}
                  className="group flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Add Task</div>
                    <div className="text-xs text-gray-500 mt-0.5">Create a new todo with deadline</div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            // Messages List
            <div className="space-y-1">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={{
      ...message,
      parts: message.content ? [{ type: 'text', text: message.content }] : []
    }}
                  isLoading={isLoading && message.role === 'assistant' && !message.content}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm animate-fadeIn">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}