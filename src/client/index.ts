import 'cross-fetch/polyfill';
import type { GigapayConfig, GigapayClient } from '../types';
import { GigapayError } from '../errors/GigapayError';
import { createEmployeesAPI } from '../resources/employees';
import { createIntegrationsAPI } from '../resources/integrations';
import { createInvoicesAPI } from '../resources/invoices';

const DEFAULT_BASE_URL = 'https://api.gigapay.se/v2';
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createHeaders = (config: GigapayConfig): HeadersInit => ({
  'Authorization': `Token ${config.apiKey}`,
  'Integration-Id': config.integrationId,
  'Content-Type': 'application/json',
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 429) {
      // Return special error for rate limiting
      throw new GigapayError({
        message: 'Rate limit exceeded',
        status: 429,
        code: 'RATE_LIMIT_EXCEEDED',
      });
    }
    throw await GigapayError.fromResponse(response);
  }

  return response.json() as Promise<T>;
};

interface HttpClient {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, body: unknown) => Promise<T>;
  put: <T>(endpoint: string, body: unknown) => Promise<T>;
  patch: <T>(endpoint: string, body: unknown) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

const createHttpClient = (config: GigapayConfig): HttpClient => {
  const request = async <T>(
    method: string,
    endpoint: string,
    body?: unknown,
    retryCount = DEFAULT_RETRY_COUNT
  ): Promise<T> => {
    const url = `${config.baseUrl || DEFAULT_BASE_URL}${endpoint}`;
    const headers = createHeaders(config);

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        return await handleResponse<T>(response);
      } catch (error) {
        if (
          error instanceof GigapayError &&
          error.status === 429 &&
          attempt < retryCount - 1
        ) {
          // Exponential backoff for rate limits
          await sleep(DEFAULT_RETRY_DELAY * Math.pow(2, attempt));
          continue;
        }
        throw error;
      }
    }

    throw new Error('Maximum retry attempts reached');
  };

  return {
    get: <T>(endpoint: string) => request<T>('GET', endpoint),
    post: <T>(endpoint: string, body: unknown) => request<T>('POST', endpoint, body),
    put: <T>(endpoint: string, body: unknown) => request<T>('PUT', endpoint, body),
    patch: <T>(endpoint: string, body: unknown) => request<T>('PATCH', endpoint, body),
    delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),
  };
};

export const createClient = (config: GigapayConfig): GigapayClient => {
  const httpClient = createHttpClient(config);

  return {
    employees: createEmployeesAPI(httpClient),
    integrations: createIntegrationsAPI(httpClient),
    invoices: createInvoicesAPI(httpClient)
  };
}; 