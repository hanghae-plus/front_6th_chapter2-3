/**
 * API configuration for different environments
 */
export const API_BASE_URL = import.meta.env.PROD ? "https://dummyjson.com" : "/api"

/**
 * Create API URL with proper base
 */
export const createApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${API_BASE_URL}/${cleanPath}`
}
