import { Integration, CreateIntegrationRequest } from './models';
import { PaginatedResponse } from '../common';

export type ListIntegrationsResponse = PaginatedResponse<Integration>;

export interface ListIntegrationsOptions {
  page?: number;
  perPage?: number;
  type?: number;
}

export interface IntegrationsAPI {
  /**
   * List all integrations with optional filters
   * @param options - Pagination and filter options
   */
  list(options?: ListIntegrationsOptions): Promise<ListIntegrationsResponse>;

  /**
   * Create a new integration
   * @param integration Integration creation data
   */
  create(integration: CreateIntegrationRequest): Promise<Integration>;

  /**
   * Get an integration by ID
   * @param id - The integration ID
   */
  read(id: string): Promise<Integration>;

  /**
   * Update an integration
   * @param id - The integration ID
   * @param data - The integration data to update
   */
  update(id: string, data: Partial<CreateIntegrationRequest>): Promise<Integration>;

  /**
   * Delete an integration
   * @param id - The integration ID
   */
  delete(id: string): Promise<void>;

  /**
   * Get integration details by external ID
   * @param externalId - The external ID of the integration
   */
  read(externalId: string): Promise<Integration>;
} 