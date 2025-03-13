import type { HttpClient } from '../types/common';
import type {
  Employee,
  CreateEmployeeRequest,
  ListEmployeesResponse,
  EmployeesAPI,
  ListEmployeesOptions,
} from '../types/employees';

export const createEmployeesAPI = (httpClient: HttpClient): EmployeesAPI => ({
  /**
   * List employees
   * @param options - Pagination options
   * @returns List of employees
   */
  async list(
    options: ListEmployeesOptions = {}
  ): Promise<ListEmployeesResponse> {
    const params = new URLSearchParams();
    
    // Add all parameters
    const entries = Object.entries(options).filter(([_, value]) => value !== undefined);
    
    // Sort entries alphabetically and add to params
    entries.sort(([a], [b]) => a.localeCompare(b)).forEach(([key, value]) => {
      if (key === 'page') {
        params.append('offset', ((value as number - 1) * (options.perPage || 10)).toString());
      } else if (key === 'perPage') {
        params.append('limit', value.toString());
      } else {
        params.append(key, value.toString());
      }
    });

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

  async update(externalId: string, data: Partial<CreateEmployeeRequest>): Promise<Employee> {
    return httpClient.put<Employee>(`/employees/${externalId}`, data);
  },

  async partialUpdate(externalId: string, data: Partial<CreateEmployeeRequest>): Promise<Employee> {
    return httpClient.patch<Employee>(`/employees/${externalId}`, data);
  },

  async delete(externalId: string): Promise<void> {
    return httpClient.delete(`/employees/${externalId}`);
  },

  async resend(externalId: string): Promise<void> {
    return httpClient.patch(`/employees/${externalId}/resend`, {});
  },
}); 