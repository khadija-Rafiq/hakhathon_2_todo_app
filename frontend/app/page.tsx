'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';

export default function HomePage() {
  const router = useRouter();

  const demoTasks = [
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Draft and send project proposal to team',
      completed: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Review team feedback',
      description: 'Go through and incorporate team comments',
      completed: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Update documentation',
      description: 'Add latest changes to README',
      completed: true,
      priority: 'low'
    }
  ];

  const handleSignIn = () => {
    router.push('/login');
  };

  const completedCount = demoTasks.filter(t => t.completed).length;
  const pendingCount = demoTasks.filter(t => !t.completed).length;
  const completionRate = demoTasks.length > 0 ? Math.round((completedCount / demoTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Sign In Button */}
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

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all hover:shadow-md active:scale-95"
            >
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Todo App</h2>
            <p className="text-gray-600">Sign in to manage your tasks and boost your productivity</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Tasks */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{demoTasks.length}</span>
              </div>
              <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
            </div>

            {/* Pending Tasks */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{pendingCount}</span>
              </div>
              <p className="text-orange-100 text-sm font-medium">Pending</p>
            </div>

            {/* Completed Tasks */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{completedCount}</span>
              </div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
            </div>

            {/* Completion Rate */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{completionRate}%</span>
              </div>
              <p className="text-purple-100 text-sm font-medium">Completion Rate</p>
            </div>
          </div>

          {/* Sample Tasks */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sample Tasks</h3>
            <div className="space-y-3">
              {demoTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 pt-1">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Ready to organize your tasks?</h3>
            <p className="text-blue-100 mb-6">Sign in to create, manage, and track your tasks with our intelligent Todo App.</p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}