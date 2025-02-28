import type { Employee, ListEmployeesResponse } from '../types/employees';
import { createEmployeesAPI } from './employees';

// Mock response data
const mockEmployee: Employee = {
  id: 'd15f2078-4193-43c5-a924-f69dda7d04df',
  name: 'John Doe',
  cellphone_number: '+46701234567',
  email: 'john@example.com',
  country: 'SWE',
  metadata: {},
  created_at: '2024-02-28T12:00:00Z',
  notified_at: '2024-02-28T12:01:00Z',
  claimed_at: '2024-02-28T12:02:00Z',
  verified_at: '2024-02-28T12:03:00Z',
  invited_at: '2024-02-28T12:04:00Z',
};

const mockListResponse: ListEmployeesResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [mockEmployee],
};

// Mock HTTP client
const mockHttpClient = {
  get: jest.fn().mockResolvedValue(mockListResponse),
  post: jest.fn().mockResolvedValue(mockEmployee),
  put: jest.fn(),
  delete: jest.fn(),
};

describe('employees resource', () => {
  const employeesAPI = createEmployeesAPI(mockHttpClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch employees without parameters', async () => {
      const response = await employeesAPI.list();
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/employees');
      expect(response).toEqual(mockListResponse);
    });

    it('should fetch employees with pagination parameters', async () => {
      const options = { page: 2, perPage: 20 };
      await employeesAPI.list(options);
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/employees?offset=20&limit=20');
    });
  });

  describe('create', () => {
    it('should create a new employee with all fields', async () => {
      const employeeData = {
        id: 'd15f2078-4193-43c5-a924-f69dda7d04df',
        name: 'John Doe',
        cellphone_number: '+46701234567',
        email: 'john@example.com',
        country: 'SWE',
        metadata: {
          department: 'Engineering',
          role: 'Developer'
        },
      };

      const response = await employeesAPI.create(employeeData);
      
      expect(mockHttpClient.post).toHaveBeenCalledWith('/employees', employeeData);
      expect(response).toEqual(mockEmployee);
    });

    it('should create a new employee with only required fields', async () => {
      const employeeData = {
        name: 'John Doe',
        country: 'SWE',
      };

      const response = await employeesAPI.create(employeeData);
      
      expect(mockHttpClient.post).toHaveBeenCalledWith('/employees', employeeData);
      expect(response).toEqual(mockEmployee);
    });

    it('should create a new employee with null optional fields', async () => {
      const employeeData = {
        name: 'John Doe',
        cellphone_number: null,
        email: null,
        country: 'SWE',
        metadata: {},
      };

      const response = await employeesAPI.create(employeeData);
      
      expect(mockHttpClient.post).toHaveBeenCalledWith('/employees', employeeData);
      expect(response).toEqual(mockEmployee);
    });
  });
}); 