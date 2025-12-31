
'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { LogOut, Sparkles, MessageSquare } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
  onOpenChat?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout, onOpenChat }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    onLogout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
              <p className="text-xs text-gray-500">Stay organized</p>
            </div>
          </div>

          {/* Right Side - User Info & Actions */}
          <div className="flex items-center gap-3">
            {/* User Welcome */}
            <div className="hidden md:block text-right mr-2">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="text-sm font-semibold text-gray-900">{userName}</p>
            </div>

            {/* Open AI Chat Button */}
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all hover:shadow-md active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">AI Chat</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-all border border-red-200 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;