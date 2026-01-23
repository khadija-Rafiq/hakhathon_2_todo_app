'use client';

// Authentication helper functions
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  return !!token;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  console.log('Attempting login with API URL:', API_URL);
  console.log('Login endpoint:', `${API_URL}/api/auth/login`);
  
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const errorData = await response.json();
        console.log('Error response data:', errorData);
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        console.log('Failed to parse error response:', e);
        errorMessage = response.statusText || `HTTP Error ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Login successful, response data:', data);
    
    // Store token and user
    if (data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Failed to connect to server. Please check if the backend is running on http://localhost:8000');
    }
    throw error;
  }
}

export async function signUp(name: string, email: string, password: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        name,
        email: email.toLowerCase().trim(),
        password
      })
    });
    
    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorMessage = response.statusText || `HTTP Error ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Failed to connect to server. Please check if the backend is running on http://localhost:8000');
    }
    throw error;
  }
}

export function signOut() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function useSession() {
  return {
    data: getUser(),
    status: isAuthenticated() ? 'authenticated' : 'unauthenticated'
  };
}