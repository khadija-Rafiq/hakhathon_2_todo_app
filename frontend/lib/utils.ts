/**
 * Utility functions for the frontend
 */

/**
 * Get the API base URL from environment variables or use a default
 */
export function getApiUrl(): string {
  // Always use environment variable, no fallback to localhost in production
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined!');
    // Only use localhost as fallback in development
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:8000';
    }
    throw new Error('API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
  }
  
  return apiUrl;
}