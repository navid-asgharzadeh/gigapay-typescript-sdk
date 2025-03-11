import type { HttpClient } from '../types/common';
import type {
  Integration,
  CreateIntegrationRequest,
  ListIntegrationsResponse,
  IntegrationsAPI,
  ListIntegrationsOptions,
} from '../types/integrations';

export const createIntegrationsAPI = (httpClient: HttpClient): IntegrationsAPI => ({
  async list(
    options: ListIntegrationsOptions = {}
  ): Promise<ListIntegrationsResponse> {
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
    const endpoint = `/integrations${queryString ? `?${queryString}` : ''}`;

    return httpClient.get<ListIntegrationsResponse>(endpoint);
  },

  async create(integration: CreateIntegrationRequest): Promise<Integration> {
    return httpClient.post<Integration>('/integrations', integration);
  },

  async read(id: string): Promise<Integration> {
    return httpClient.get<Integration>(`/integrations/${id}`);
  },

  async update(id: string, data: Partial<CreateIntegrationRequest>): Promise<Integration> {
    return httpClient.put<Integration>(`/integrations/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete(`/integrations/${id}`);
  },
}); 