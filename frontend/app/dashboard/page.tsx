'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import Footer from '@/components/Footer';
import { getUser, signOut, isAuthenticated, getToken } from '@/lib/auth';
import { X, Sparkles } from 'lucide-react';

// Import your ChatInterface if it exists, otherwise we'll use a simple version
// import { ChatInterface } from '@/components/ChatInterface';

// Simple Chat Interface (replace with your actual ChatInterface)
function SimpleChatInterface({ userId, token }: { userId: string; token: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Call your chat API here
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      const aiMsg = { role: 'assistant', content: data.data?.response || 'Sorry, something went wrong.' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
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
      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-b from-gray-50 to-white">
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
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-200 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
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
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
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
        <p className="text-xs text-gray-400 text-center mt-3">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

// ChatModal Component
function ChatModal({ isOpen, onClose, userId, token }: { 
  isOpen: boolean; 
  onClose: () => void; 
  userId: string; 
  token: string;
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
            <SimpleChatInterface userId={userId} token={token} />
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
        token={getToken() || ''}
      />
    </div>
  );
}