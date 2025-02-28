/**
 * SDK configuration interface
 */
export interface GigapayConfig {
  apiKey: string;
  integrationId: string;
  baseUrl?: string;
}

/**
 * Common error response from the API
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Common pagination response structure
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Common HTTP client interface used by all resources
 */
export interface HttpClient {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, body: unknown) => Promise<T>;
  put: <T>(endpoint: string, body: unknown) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
} 