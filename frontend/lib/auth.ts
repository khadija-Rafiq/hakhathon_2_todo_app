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
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ 
      email: email.toLowerCase().trim(), 
      password 
    })
  });
  
  if (!response.ok) {
    let errorMessage = 'Login failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // If response isn't JSON, use status text
      errorMessage = response.statusText || `HTTP Error ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  
  // Store token and user
  if (data.access_token) {
    localStorage.setItem('auth_token', data.access_token);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return data;
}

export async function signUp(name: string, email: string, password: string) {
  const response = await fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
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
      // If response isn't JSON, use status text
      errorMessage = response.statusText || `HTTP Error ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  return data;
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