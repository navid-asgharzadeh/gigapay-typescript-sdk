import { PaginatedResponse } from '../common';
import { Employee, CreateEmployeeRequest } from './models';

export type ListEmployeesResponse = PaginatedResponse<Employee>;

export interface EmployeesAPI {
  /**
   * List employees with pagination support
   * @param options Pagination options
   */
  list(options?: {
    /** Page number (1-based) */
    page?: number;
    /** Number of items per page */
    perPage?: number;
  }): Promise<ListEmployeesResponse>;

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
  update(externalId: string, data: {
    name?: string;
    cellphone_number?: string;
    email?: string | null;
    country?: string;
    metadata?: Record<string, any>;
    claimed_at?: string | null;
  }): Promise<Employee>;

  /**
   * Partially update an employee by their external ID using PATCH
   * @param externalId - The external ID of the employee to update
   * @param data - The partial employee data to update
   */
  partialUpdate(externalId: string, data: {
    name?: string;
    cellphone_number?: string;
    email?: string | null;
    country?: string;
    metadata?: Record<string, any>;
    claimed_at?: string | null;
  }): Promise<Employee>;
} 