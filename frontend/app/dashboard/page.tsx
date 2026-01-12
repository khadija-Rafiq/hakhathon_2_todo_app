'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import Footer from '@/components/Footer';
import { getUser, signOut, isAuthenticated, getToken } from '@/lib/auth';
import { X, Sparkles } from 'lucide-react';
import { getApiUrl } from '@/lib/utils';

// Import your ChatInterface if it exists, otherwise we'll use a simple version
// import { ChatInterface } from '@/components/ChatInterface';

// Simple Chat Interface (replace with your actual ChatInterface)
function SimpleChatInterface({ userId, token, userName }: { userId: string; token: string; userName: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user initial from name
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  // Load conversation history on component mount
  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        // Get user's latest conversation
        const conversationsResponse = await fetch(`${getApiUrl()}/api/${userId}/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!conversationsResponse.ok) {
          throw new Error(`Failed to fetch conversations: ${conversationsResponse.status}`);
        }

        const conversations = await conversationsResponse.json();

        if (conversations.length > 0) {
          // Get the most recent conversation
          const latestConversation = conversations[0];
          setCurrentConversationId(latestConversation.id);

          // Get messages for this conversation
          const messagesResponse = await fetch(`${getApiUrl()}/api/${userId}/conversations/${latestConversation.id}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!messagesResponse.ok) {
            throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
          }

          const messages = await messagesResponse.json();
          setMessages(messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.created_at
          })));
        } else {
          // No existing conversations, start fresh
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
        // Continue with empty messages if there's an error
        setMessages([]);
      }
    };

    loadConversationHistory();
  }, [userId, token]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = {
      role: 'user',
      content: input,
      isPending: true // Mark as pending until we get the response
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call your chat API here
      const requestBody: any = { message: input };
      if (currentConversationId) {
        requestBody.conversation_id = currentConversationId;
      }

      const response = await fetch(`${getApiUrl()}/api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      // Update the user message to remove the pending state and add ID
      setMessages(prev => {
        const updated = [...prev];
        const userMsgIndex = updated.findIndex(msg => msg.content === input && msg.isPending);
        if (userMsgIndex !== -1) {
          updated[userMsgIndex] = {
            id: data.data?.user_message_id,
            role: 'user',
            content: input
          };
        }
        return updated;
      });

      // Add the assistant's response with ID
      const aiMsg = {
        id: data.data?.ai_message_id,
        role: 'assistant',
        content: data.data?.response || 'Sorry, something went wrong.'
      };

      setMessages(prev => [...prev, aiMsg]);

      // Update conversation ID if it was created in this request
      if (data.data?.conversation_id) {
        setCurrentConversationId(data.data.conversation_id);
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Remove the pending user message and show error
      setMessages(prev => prev.filter(msg => !(msg.content === input && msg.isPending)));
      const errorMsg = { role: 'assistant', content: 'Connection error. Please try again.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-900">AI Chat Assistant</h2>
        <p className="text-sm text-gray-500 mt-1">Ask me anything about your tasks</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Welcome! How can I help?
            </h3>
            <p className="text-gray-500 max-w-md">
              I can help you manage your tasks, answer questions, and boost your productivity!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || `msg-${idx}`}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 mb-4`}
              >
                {msg.role === 'user' ? (
                  <>
                    <div className="bg-blue-600 text-white rounded-2xl px-4 py-2 max-w-[70%] shadow-sm">
                      {msg.content}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {userInitial}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      🤖
                    </div>
                    <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 max-w-[70%] shadow-sm">
                      {msg.content}
                    </div>
                  </>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-2xl px-4 py-2 max-w-[70%] shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your todos..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div className="flex justify-between items-center mt-3">
          <button
            onClick={() => {
              // Start a new conversation by resetting messages and conversation ID
              setMessages([]);
              setCurrentConversationId(null);
            }}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium shadow-sm transition-all"
          >
            New Conversation
          </button>
          <p className="text-xs text-gray-500">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
}

// ChatModal Component
function ChatModal({ isOpen, onClose, userId, token, userName }: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  token: string;
  userName: string;
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl pointer-events-auto animate-slideUp overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur-sm hover:bg-gray-100 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          </button>

          {/* Chat Interface */}
          <div className="h-full overflow-hidden">
            <SimpleChatInterface userId={userId} token={token} userName={userName} />
          </div>
        </div>
      </div>
    </>
  );
}

// Main Dashboard Component
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userData = getUser();
    if (userData) {
      setUser(userData);
    } else {
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Header 
        userName={user?.name || 'User'} 
        onLogout={handleLogout}
        onOpenChat={() => setIsChatOpen(true)}
      />
      
      {/* Main Content */}
      <main className="flex-1">
        <TaskList userId={user?.id || ''} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userId={user?.id || ''}
        userName={user?.name || 'User'}
        token={getToken() || ''}
      />
    </div>
  );
}