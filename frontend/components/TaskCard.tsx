
import React from 'react';
import { Check, Edit2, Trash2, Clock, Calendar } from 'lucide-react';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggle }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        task.completed 
          ? 'border-green-200 bg-gradient-to-br from-green-50/50 via-white to-green-50/30' 
          : 'border-gray-200 hover:border-blue-400 shadow-md hover:shadow-blue-100'
      }`}
    >
      {/* Decorative gradient bar on top */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
        task.completed 
          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`} />

      {/* Main Content */}
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
            task.completed
              ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 shadow-lg shadow-green-200'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md'
          }`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3 
            className={`font-bold text-lg mb-1 transition-all ${
              task.completed 
                ? 'line-through text-gray-400' 
                : 'text-gray-900 group-hover:text-blue-600'
            }`}
          >
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm mt-2 line-clamp-2 ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {/* Date Badge */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              task.completed 
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(task.created_at)}</span>
            </div>

            {/* Completed Badge */}
            {task.completed && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md">
                <Check className="w-3 h-3" strokeWidth={3} />
                <span>Done</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons - Show on Hover */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button
          onClick={() => onEdit(task.id)}
          className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md"
          aria-label="Edit task"
          title="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-md"
          aria-label="Delete task"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom decorative element for completed tasks */}
      {task.completed && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent" />
      )}
    </div>
  );
};

export default TaskCard;