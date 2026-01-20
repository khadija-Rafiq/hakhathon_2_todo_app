import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Define types
interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}

// API client functions for task operations
export const taskApi = {
  // Get all tasks for a user with optional status filtering
  getTasks: async (userId: string, status?: 'all' | 'pending' | 'completed'): Promise<Task[]> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    let url = `${API_URL}/api/${userId}/tasks`;
    if (status && status !== 'all') {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to fetch tasks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Handle both direct array response and wrapped response
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.data) {
      return data.data;
    } else {
      return [];
    }
  },

  // Get a specific task
  getTask: async (userId: string, taskId: number): Promise<Task> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to fetch task: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Handle both direct response and wrapped response
    return data.data || data;
  },

  // Create a new task
  createTask: async (
    userId: string,
    data: { title: string; description?: string }
  ): Promise<Task> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/api/${userId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to create task: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    // Handle both direct response and wrapped response
    return result.data || result;
  },

  // Update an existing task
  updateTask: async (
    userId: string,
    taskId: number,
    data: { title?: string; description?: string }
  ): Promise<Task> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to update task: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    // Handle both direct response and wrapped response
    return result.data || result;
  },

  // Delete a task
  deleteTask: async (userId: string, taskId: number): Promise<Task> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to delete task: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    // Handle both direct response and wrapped response
    return result.data || result;
  },

  // Toggle task completion status
  toggleComplete: async (userId: string, taskId: number, completed?: boolean): Promise<Task> => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const requestBody: { completed?: boolean } = {};
    if (completed !== undefined) {
      requestBody.completed = completed;
    }

    const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to update task completion: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    // Handle both direct response and wrapped response
    return result.data || result;
  },
};

// Export the API client
export default taskApi;