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
} 