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

// Initialize the client
const client = createClient({
  apiKey: 'your_api_key',
  integrationId: 'your_integration_id',
});
```

## API Reference

### Employees

#### List Employees

```typescript
// Get all employees (paginated)
const { results, count, next, previous } = await client.employees.list({
  page: 1,      // Optional
  perPage: 10,  // Optional
});
```

#### Get Employee

```typescript
// Get employee by ID
const employee = await client.employees.read('employee-uuid');
```

#### Create Employee

```typescript
// Create with required fields
const employee = await client.employees.create({
  name: 'John Doe',
  country: 'SWE',
});

// Create with all fields
const employeeWithDetails = await client.employees.create({
  name: 'John Doe',
  cellphone_number: '+46701234567',
  email: 'john@example.com',
  country: 'SWE',
  metadata: {
    department: 'Engineering',
  },
});
```

#### Update Employee

```typescript
// Full update (PUT)
const updatedEmployee = await client.employees.update('employee-uuid', {
  name: 'Jane Doe',
  email: 'jane@example.com',
});

// Partial update (PATCH)
const partiallyUpdatedEmployee = await client.employees.partialUpdate('employee-uuid', {
  metadata: {
    department: 'Sales',
  },
});
```

#### Delete Employee

```typescript
// Delete an employee by ID
await client.employees.delete('employee-uuid');
```

#### Resend Invitations

```typescript
// Resend full invitation
await client.employees.resend('employee-uuid');

// Resend partial invitation
await client.employees.resendPartialUpdate('employee-uuid');
```

### Error Handling

```typescript
try {
  const employee = await client.employees.read('invalid-id');
} catch (error) {
  if (isGigapayError(error)) {
    console.error(`API Error: ${error.message} (Code: ${error.code})`);
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build
```

## License

MIT 