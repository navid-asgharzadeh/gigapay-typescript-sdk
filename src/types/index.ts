export * from './common';
export * from './employees';
export * from './integrations';
export * from './invoices';

export interface GigapayConfig {
  apiKey: string;
  integrationId: string;
  baseUrl?: string;
}

export interface GigapayClient {
  employees: import('./employees').EmployeesAPI;
  integrations: import('./integrations').IntegrationsAPI;
  invoices: import('./invoices').InvoicesAPI;
} 