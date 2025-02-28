import type { ErrorResponse } from '../types';

export class GigapayError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor({
    message,
    status,
    code,
    details,
  }: {
    message: string;
    status: number;
    code: string;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = 'GigapayError';
    this.status = status;
    this.code = code;
    this.details = details;
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, GigapayError.prototype);
  }

  static async fromResponse(response: Response): Promise<GigapayError> {
    const data = (await response.json()) as ErrorResponse;
    
    return new GigapayError({
      message: data.error.message,
      status: response.status,
      code: data.error.code,
      details: data.error.details,
    });
  }
}

export const isGigapayError = (error: unknown): error is GigapayError => {
  return error instanceof GigapayError;
}; 