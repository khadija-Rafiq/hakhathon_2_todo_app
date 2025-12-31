
'use client';

import { useState, useEffect } from 'react';
import { taskApi } from '@/lib/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Plus, Search, Inbox, CheckCircle2, Clock, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskListProps {
  userId: string;
}

const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await taskApi.getTasks(userId, filter);
        setTasks(tasksData);
      } catch (err: any) {
        setError(err.message || 'Failed to load tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter, userId]);

  const handleAddTask = async (data: { title: string; description: string }) => {
    try {
      const newTask = await taskApi.createTask(userId, data);
      setTasks([newTask, ...tasks]);
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
    }
  };

  const handleEditTask = async (data: { title: string; description: string }) => {
    if (!editingTask) return;
    try {
      const updatedTask = await taskApi.updateTask(userId, editingTask.id, data);
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await taskApi.deleteTask(userId, deletingTask.id);
      setTasks(tasks.filter(t => t.id !== deletingTask.id));
      setDeletingTask(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const updatedTask = await taskApi.toggleComplete(userId, taskId);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'pending' ? !task.completed :
      task.completed;
    
    const matchesSearch = 
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Tasks */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{tasks.length}</span>
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

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Tasks
            </h1>
            <p className="text-gray-600">
              {tasks.length === 0 
                ? 'No tasks yet. Create your first task!'
                : `Managing ${tasks.length} task${tasks.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
            filter === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-105'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <Inbox className="w-5 h-5" />
          <span>All</span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            filter === 'all' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {tasks.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
            filter === 'pending'
              ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white scale-105'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Pending</span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            filter === 'pending' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
            filter === 'completed'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white scale-105'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300 hover:bg-green-50'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Completed</span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            filter === 'completed' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {completedCount}
          </span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 font-bold text-xl">×</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border-2 border-gray-200 animate-pulse h-40" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchQuery ? 'No tasks found' : filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </h3>
          <p className="text-gray-600 mb-8">
            {searchQuery ? `No tasks match "${searchQuery}"` : 'Create your first task to get started!'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create First Task
            </button>
          )}
        </div>
      )}

      {/* Task Grid */}
      {!loading && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(id) => setEditingTask(tasks.find(t => t.id === id) || null)}
              onDelete={(id) => setDeletingTask(tasks.find(t => t.id === id) || null)}
              onToggle={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h3>
            <TaskForm onSubmit={handleAddTask} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h3>
            <TaskForm task={editingTask} onSubmit={handleEditTask} onCancel={() => setEditingTask(null)} />
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={!!deletingTask}
        taskTitle={deletingTask?.title || ''}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
};

export default TaskList;