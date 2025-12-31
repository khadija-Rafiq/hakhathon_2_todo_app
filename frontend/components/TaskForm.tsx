

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading = false }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    if (title.length < 1 || title.length > 200) {
      setTitleError('Title must be between 1 and 200 characters');
      return;
    }

    setTitleError('');
    
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  };

  // Reset form when task prop changes
  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setTitleError('');
  }, [task]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none transition-all ${
            titleError 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
          }`}
          placeholder="e.g., Buy groceries, Finish report..."
          maxLength={200}
          disabled={isLoading}
        />
        
        {/* Error Message */}
        {titleError && (
          <div className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4" />
            <span>{titleError}</span>
          </div>
        )}
        
        {/* Character Count */}
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className={`${titleError ? 'text-red-500' : 'text-gray-500'}`}>
            {title.length}/200 characters
          </span>
          {title.length > 180 && (
            <span className="text-orange-500 font-medium">
              {200 - title.length} characters remaining
            </span>
          )}
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
          placeholder="Add more details about your task..."
          rows={4}
          maxLength={5000}
          disabled={isLoading}
        />
        <div className="text-xs text-gray-500 mt-2">
          {description.length}/5000 characters
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-95"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {task ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            task ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;