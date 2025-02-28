export { createClient } from './client';
export * as employees from './resources/employees';
export { GigapayError, isGigapayError } from './errors/GigapayError';
export type {
  GigapayConfig,
  GigapayClient,
  Employee,
  CreateEmployeeRequest,
  ListEmployeesResponse,
  ErrorResponse,
} from './types'; 