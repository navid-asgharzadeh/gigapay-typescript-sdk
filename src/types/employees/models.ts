/**
 * Employee entity returned by the API
 */
export interface Employee {
  id: string;
  name: string;
  cellphone_number: string | null;
  email: string | null;
  country: string;
  metadata: Record<string, unknown>;
  created_at: string;
  notified_at: string | null;
  claimed_at: string | null;
  verified_at: string | null;
  invited_at: string | null;
}

/**
 * Request body schema for creating an employee
 * @see https://api.gigapay.se/v2/employees
 */
export interface CreateEmployeeRequest {
  /** Optional UUID, if not provided one will be generated */
  id?: string;
  /** Full name of user, 1-255 characters */
  name: string;
  /** Optional cellphone number, <= 17 characters */
  cellphone_number?: string | null;
  /** Optional email, <= 254 characters */
  email?: string | null;
  /** Country code, 1-3 characters (e.g., 'SWE') */
  country: string;
  /** Optional metadata object */
  metadata?: Record<string, unknown>;
} 