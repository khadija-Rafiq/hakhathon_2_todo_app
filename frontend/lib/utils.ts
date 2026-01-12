/**
 * Utility functions for the frontend
 */

/**
 * Get the API base URL from environment variables or use a default
 */
export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';
  } else {
    // Server-side (Next.js API routes, SSR, etc.)
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';
  }
}