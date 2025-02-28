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
  patch: jest.fn(),
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

  describe('read', () => {
    beforeEach(() => {
      // Override the mock for get to return a single employee
      mockHttpClient.get.mockResolvedValue(mockEmployee);
    });

    it('should fetch an employee by external ID', async () => {
      const externalId = 'd15f2078-4193-43c5-a924-f69dda7d04df';
      const response = await employeesAPI.read(externalId);
      
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/employees/${externalId}`);
      expect(response).toEqual(mockEmployee);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      const mockHttpClient = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn().mockResolvedValue({
          ...mockEmployee,
          name: 'Updated Name',
          email: 'updated@example.com'
        }),
        patch: jest.fn(),
        delete: jest.fn(),
      };

      const api = createEmployeesAPI(mockHttpClient);
      const response = await api.update('test-id', {
        name: 'Updated Name',
        email: 'updated@example.com'
      });

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        '/employees/test-id',
        {
          name: 'Updated Name',
          email: 'updated@example.com'
        }
      );
      expect(response).toEqual({
        ...mockEmployee,
        name: 'Updated Name',
        email: 'updated@example.com'
      });
    });

    it('should handle partial updates', async () => {
      const mockHttpClient = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn().mockResolvedValue({
          ...mockEmployee,
          metadata: { department: 'Engineering' }
        }),
        patch: jest.fn(),
        delete: jest.fn(),
      };

      const api = createEmployeesAPI(mockHttpClient);
      const response = await api.update('test-id', {
        metadata: { department: 'Engineering' }
      });

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        '/employees/test-id',
        {
          metadata: { department: 'Engineering' }
        }
      );
      expect(response).toEqual({
        ...mockEmployee,
        metadata: { department: 'Engineering' }
      });
    });
  });

  describe('partialUpdate', () => {
    it('should partially update an employee', async () => {
      const mockHttpClient = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn().mockResolvedValue({
          ...mockEmployee,
          name: 'Updated Name',
          email: 'updated@example.com'
        }),
        delete: jest.fn(),
      };

      const api = createEmployeesAPI(mockHttpClient);
      const response = await api.partialUpdate('test-id', {
        name: 'Updated Name',
        email: 'updated@example.com'
      });

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/employees/test-id',
        {
          name: 'Updated Name',
          email: 'updated@example.com'
        }
      );
      expect(response).toEqual({
        ...mockEmployee,
        name: 'Updated Name',
        email: 'updated@example.com'
      });
    });

    it('should handle single field updates', async () => {
      const mockHttpClient = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn().mockResolvedValue({
          ...mockEmployee,
          metadata: { department: 'Engineering' }
        }),
        delete: jest.fn(),
      };

      const api = createEmployeesAPI(mockHttpClient);
      const response = await api.partialUpdate('test-id', {
        metadata: { department: 'Engineering' }
      });

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/employees/test-id',
        {
          metadata: { department: 'Engineering' }
        }
      );
      expect(response).toEqual({
        ...mockEmployee,
        metadata: { department: 'Engineering' }
      });
    });
  });

  describe('delete', () => {
    it('should delete an employee', async () => {
      const externalId = 'test-id';
      await employeesAPI.delete(externalId);
      
      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/employees/${externalId}`);
    });
  });

  describe('resend', () => {
    it('should resend an invitation', async () => {
      const externalId = 'test-id';
      await employeesAPI.resend(externalId);
      
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/employees/${externalId}/resend`,
        {}
      );
    });
  });

  describe('resendPartialUpdate', () => {
    it('should partially resend an invitation', async () => {
      const externalId = 'test-id';
      await employeesAPI.resendPartialUpdate(externalId);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        `/employees/${externalId}/resend`,
        {}
      );
    });
  });
}); 