import type { HttpClient } from '../types/common';
import type {
  Employee,
  CreateEmployeeRequest,
  ListEmployeesResponse,
  EmployeesAPI,
} from '../types/employees';

export const createEmployeesAPI = (httpClient: HttpClient): EmployeesAPI => ({
  /**
   * List employees
   * @param options - Pagination options
   * @returns List of employees
   */
  async list(
    options: {
      page?: number;
      perPage?: number;
    } = {}
  ): Promise<ListEmployeesResponse> {
    const params = new URLSearchParams();
    if (options.page) params.append('offset', ((options.page - 1) * (options.perPage || 10)).toString());
    if (options.perPage) params.append('limit', options.perPage.toString());

    const queryString = params.toString();
    const endpoint = `/employees${queryString ? `?${queryString}` : ''}`;

    return httpClient.get<ListEmployeesResponse>(endpoint);
  },

  /**
   * Create an employee
   * @param employee - Employee object
   * @returns Created employee
   */
  async create(employee: CreateEmployeeRequest): Promise<Employee> {
    return httpClient.post<Employee>('/employees', employee);
  },

  async read(externalId: string): Promise<Employee> {
    return httpClient.get<Employee>(`/employees/${externalId}`);
  },

  async update(externalId: string, data: {
    name?: string;
    cellphone_number?: string;
    email?: string | null;
    country?: string;
    metadata?: Record<string, any>;
    claimed_at?: string | null;
  }): Promise<Employee> {
    return httpClient.put<Employee>(`/employees/${externalId}`, data);
  },

  async partialUpdate(externalId: string, data: {
    name?: string;
    cellphone_number?: string;
    email?: string | null;
    country?: string;
    metadata?: Record<string, any>;
    claimed_at?: string | null;
  }): Promise<Employee> {
    return httpClient.patch<Employee>(`/employees/${externalId}`, data);
  },

  async delete(externalId: string): Promise<void> {
    return httpClient.delete(`/employees/${externalId}`);
  },
}); 