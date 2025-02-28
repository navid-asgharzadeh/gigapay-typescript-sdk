# Gigapay TypeScript SDK

A modern, type-safe TypeScript SDK for the Gigapay API.

## Features

- 🔒 Type-safe API client
- 🚀 Modern ESM and CommonJS support
- 💪 Zero dependencies (except cross-fetch polyfill)
- 🔄 Automatic retry with exponential backoff
- 📦 Small bundle size (<5kB minified+gzipped)

## Installation

```bash
npm gigapay-typescript-sdk
```

## Quick Start

```typescript
import { createClient } from 'gigapay-typescript-sdk';

// Create a client instance
const client = createClient({
  apiKey: 'your_api_key',
  integrationId: 'your_integration_id',
});

// List employees
const { results: employees } = await client.employees.list({
  page: 1,
  perPage: 10,
});

// Create a new employee (minimal)
const employee = await client.employees.create({
  name: 'John Doe',
  country: 'SWE',
});

// Create a new employee (with all fields)
const employeeWithDetails = await client.employees.create({
  id: 'd15f2078-4193-43c5-a924-f69dda7d04df', // Optional UUID
  name: 'John Doe',
  cellphone_number: '+46701234567',
  email: 'john@example.com',
  country: 'SWE',
  metadata: {
    department: 'Engineering',
    role: 'Developer',
    employeeId: 'EMP123',
  },
});
```

## API Reference

### Client Configuration

The client can be configured with the following options:

```typescript
interface GigapayConfig {
  apiKey: string;        // Your Gigapay API key
  integrationId: string; // Your integration ID
  baseUrl?: string;      // Optional custom base URL
}
```

### Employees API

#### List Employees

```typescript
const response = await client.employees.list({
  page?: number;    // Optional page number
  perPage?: number; // Optional items per page
});

// Response type
interface ListEmployeesResponse {
  count: number;           // Total number of items
  next: string | null;     // URL for next page
  previous: string | null; // URL for previous page
  results: Employee[];     // Array of employees
}

interface Employee {
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
```

#### Create Employee

Create a new employee with various levels of detail:

```typescript
// Minimal required fields
const employee = await client.employees.create({
  name: string;           // Full name (1-255 characters)
  country: string;        // Country code (1-3 characters, e.g., 'SWE')
});

// All available fields
const employee = await client.employees.create({
  id?: string;                    // Optional UUID
  name: string;                   // Full name (1-255 characters)
  cellphone_number?: string;      // Optional phone (≤17 characters)
  email?: string;                 // Optional email (≤254 characters)
  country: string;                // Country code (1-3 characters)
  metadata?: Record<string, any>; // Optional metadata object
});

// Example with metadata
const employee = await client.employees.create({
  name: 'John Doe',
  cellphone_number: '+46701234567',
  email: 'john@example.com',
  country: 'SWE',
  metadata: {
    department: 'Engineering',
    employeeId: 'EMP123',
    startDate: '2024-03-01',
    isContractor: false
  }
});
```

### Error Handling

The SDK throws typed errors that can be caught and handled appropriately:

```typescript
import { isGigapayError } from 'gigapay-typescript-sdk';

try {
  const { results } = await client.employees.list();
} catch (error) {
  if (isGigapayError(error)) {
    console.error(`API Error: ${error.message} (Code: ${error.code})`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Extending the SDK

The SDK is designed to be easily extensible. Here's how to add new API resources:

### 1. Define Types

First, define the types for your new resource in `src/types/index.ts`:

```typescript
// Types for the resource
export interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

// Request types
export interface CreatePayoutRequest {
  amount: number;
  currency: string;
  employee_id: string;
  metadata?: Record<string, unknown>;
}

// Response types
export interface ListPayoutsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payout[];
}

// API interface
export interface PayoutsAPI {
  list(options?: { page?: number; perPage?: number }): Promise<ListPayoutsResponse>;
  create(payout: CreatePayoutRequest): Promise<Payout>;
}

// Add to client interface
export interface GigapayClient {
  employees: EmployeesAPI;
  payouts: PayoutsAPI;  // Add the new resource
}
```

### 2. Create Resource Module

Create a new file `src/resources/payouts.ts`:

```typescript
import type {
  Payout,
  CreatePayoutRequest,
  ListPayoutsResponse,
  PayoutsAPI,
} from '../types';

interface HttpClient {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, body: unknown) => Promise<T>;
  put: <T>(endpoint: string, body: unknown) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

export const createPayoutsAPI = (httpClient: HttpClient): PayoutsAPI => ({
  async list(options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('offset', ((options.page - 1) * (options.perPage || 10)).toString());
    if (options.perPage) params.append('limit', options.perPage.toString());

    const queryString = params.toString();
    const endpoint = `/payouts${queryString ? `?${queryString}` : ''}`;

    return httpClient.get<ListPayoutsResponse>(endpoint);
  },

  async create(payout) {
    return httpClient.post<Payout>('/payouts', payout);
  },
});
```

### 3. Add to Client

Update `src/client/index.ts` to include the new resource:

```typescript
import { createPayoutsAPI } from '../resources/payouts';

export const createClient = (config: GigapayConfig): GigapayClient => {
  const httpClient = createHttpClient(config);

  return {
    employees: createEmployeesAPI(httpClient),
    payouts: createPayoutsAPI(httpClient),  // Add the new resource
  };
};
```

### 4. Add Tests

Create `src/resources/payouts.test.ts`:

```typescript
import type { Payout, ListPayoutsResponse } from '../types';
import { createPayoutsAPI } from './payouts';

describe('payouts resource', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  const payoutsAPI = createPayoutsAPI(mockHttpClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Add your test cases
});
```

### Best Practices

1. Keep resource modules focused and single-responsibility
2. Maintain consistent patterns across resources
3. Always include comprehensive type definitions
4. Write tests for all new functionality
5. Document new resources in the README

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Type check
npm run typecheck
```

## License

MIT 