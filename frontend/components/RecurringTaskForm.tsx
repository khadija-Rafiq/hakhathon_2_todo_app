import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, Clock, Repeat } from 'lucide-react';

interface RecurrenceRule {
  type: 'no-repeat' | 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: string[];
  dayOfMonth?: number;
  endDate?: string;
  occurrences?: number;
}

interface Task {
  id?: number;
  user_id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
  // Recurring task fields
  is_recurring?: boolean;
  recurrence_rule?: string;
  parent_task_id?: number | null;
  next_occurrence?: string | null;
  last_occurrence?: string | null;
  end_date?: string | null;
  max_occurrences?: number | null;
  occurrences_count?: number;
}

interface RecurringTaskFormProps {
  task?: Task;
  onSubmit: (data: {
    id?: number;
    title: string;
    description?: string;
    is_recurring?: boolean;
    recurrence_rule?: string;
    end_date?: string;
    max_occurrences?: number;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RecurringTaskForm: React.FC<RecurringTaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [isRecurring, setIsRecurring] = useState(task?.is_recurring || false);
  const [repeatOption, setRepeatOption] = useState<'no-repeat' | 'daily' | 'weekly' | 'monthly'>(
    task?.recurrence_rule ? JSON.parse(task.recurrence_rule!).type : 'no-repeat'
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [endDate, setEndDate] = useState<string>(task?.end_date || '');
  const [maxOccurrences, setMaxOccurrences] = useState<number | undefined>(task?.max_occurrences ?? undefined);
  const [titleError, setTitleError] = useState('');

  // Initialize recurrence settings from task if provided
  useEffect(() => {
    if (task?.recurrence_rule) {
      const rule = JSON.parse(task.recurrence_rule);
      setRecurrenceInterval(rule.interval || 1);
      setDaysOfWeek(rule.daysOfWeek || []);
      setDayOfMonth(rule.dayOfMonth || 1);
      setEndDate(task.end_date || '');
      setMaxOccurrences(task.max_occurrences ?? undefined);
    }
  }, [task]);

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

    // Prepare recurrence rule if this is a recurring task
    let recurrenceRuleStr: string | undefined;
    if (isRecurring && repeatOption !== 'no-repeat') {
      const recurrenceRule: RecurrenceRule = {
        type: repeatOption,
        interval: recurrenceInterval
      };

      if (repeatOption === 'weekly') {
        recurrenceRule.daysOfWeek = daysOfWeek.length > 0 ? daysOfWeek : ['monday'];
      } else if (repeatOption === 'monthly') {
        recurrenceRule.dayOfMonth = dayOfMonth;
      }

      recurrenceRuleStr = JSON.stringify(recurrenceRule);
    }

    await onSubmit({
      id: task?.id,
      title: title.trim(),
      description: description.trim(),
      is_recurring: isRecurring,
      recurrence_rule: recurrenceRuleStr,
      end_date: endDate || undefined,
      max_occurrences: maxOccurrences
    });
  };

  const handleRepeatChange = (option: 'no-repeat' | 'daily' | 'weekly' | 'monthly') => {
    setRepeatOption(option);
    if (option === 'no-repeat') {
      setIsRecurring(false);
    } else {
      setIsRecurring(true);
    }
  };

  const toggleDayOfWeek = (day: string) => {
    setDaysOfWeek(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const dayOptions = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ];

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

      {/* Priority and Category Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <select
            name="priority"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            defaultValue="Medium"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            defaultValue="Personal"
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Due Date Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Due Date
        </label>
        <input
          type="date"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        />
      </div>

      {/* Recurrence Section */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Repeat className="w-4 h-4" />
          Repeat
        </label>
        <select
          value={repeatOption}
          onChange={(e) => handleRepeatChange(e.target.value as any)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
        >
          <option value="no-repeat">No Repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {isRecurring && repeatOption !== 'no-repeat' && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            {/* Recurrence Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat every
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={recurrenceInterval}
                  onChange={(e) => setRecurrenceInterval(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600 capitalize">{repeatOption}</span>
              </div>
            </div>

            {/* Days of Week for Weekly Recurrence */}
            {repeatOption === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of the week
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {dayOptions.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDayOfWeek(day.value)}
                      className={`py-2 px-1 text-xs font-medium rounded-lg transition-colors ${
                        daysOfWeek.includes(day.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Day of Month for Monthly Recurrence */}
            {repeatOption === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of the month
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* End Conditions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End date (optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max occurrences (optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxOccurrences || ''}
                  onChange={(e) => setMaxOccurrences(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
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
              {task?.id ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            task?.id ? 'Update Task' : 'Add Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default RecurringTaskForm;