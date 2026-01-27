/**
 * Utility functions for the frontend
 */

/**
 * Get the API base URL from environment variables or use a default
 */
export function getApiUrl(): string {
  // In production, use the hardcoded backend URL since Azure Static Web Apps
  // doesn't inject env vars at runtime for static exports
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return 'https://khadija-rafiq-todo-backend.hf.space';
  }
  
  // For local development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
}