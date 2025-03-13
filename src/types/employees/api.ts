import { PaginatedResponse } from '../common';
import { Employee, CreateEmployeeRequest } from './models';

export type ListEmployeesResponse = PaginatedResponse<Employee>;

export interface ListEmployeesOptions {
  page?: number;
  perPage?: number;
  cellphone_number?: string;
  name?: string;
  search?: string;
  email?: string;
  created_at?: string;
  notified_at?: string;
  claimed_at?: string;
  verified_at?: string;
}

export interface EmployeesAPI {
  /**
   * List all employees with optional filters
   * @param options - Pagination and filter options
   */
  list(options?: ListEmployeesOptions): Promise<ListEmployeesResponse>;

  /**
   * Create a new employee
   * @param employee Employee creation data
   */
  create(employee: CreateEmployeeRequest): Promise<Employee>;

  /**
   * Get an employee by their external ID
   * @param externalId - The external ID of the employee
   */
  read(externalId: string): Promise<Employee>;

  /**
   * Update an employee by their external ID
   * @param externalId - The external ID of the employee to update
   * @param data - The employee data to update
   */
  update(externalId: string, data: Partial<CreateEmployeeRequest>): Promise<Employee>;

  /**
   * Partially update an employee by their external ID
   * @param externalId - The external ID of the employee to update
   * @param data - The employee data to partially update
   */
  partialUpdate(externalId: string, data: Partial<CreateEmployeeRequest>): Promise<Employee>;

  /**
   * Delete an employee by their external ID
   * @param externalId - The external ID of the employee to delete
   */
  delete(externalId: string): Promise<void>;

  /**
   * Resend an invitation to an employee
   * @param externalId - The external ID of the employee
   */
  resend(externalId: string): Promise<void>;
} 