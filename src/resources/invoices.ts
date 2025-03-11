import type { HttpClient } from '../types/common';
import type { Invoice, InvoicesAPI, ListInvoicesOptions, ListInvoicesResponse, UpdateInvoiceRequest } from '../types/invoices';

export const createInvoicesAPI = (httpClient: HttpClient): InvoicesAPI => ({
  async list(options: ListInvoicesOptions = {}): Promise<ListInvoicesResponse> {
    const params = new URLSearchParams();
    
    // Add all parameters
    const entries = Object.entries(options).filter(([_, value]) => value !== undefined);
    
    // Sort entries alphabetically and add to params
    entries.sort(([a], [b]) => a.localeCompare(b)).forEach(([key, value]) => {
      params.append(key, value.toString());
    });

    const queryString = params.toString();
    const endpoint = `/invoices${queryString ? `?${queryString}` : ''}`;

    return httpClient.get<ListInvoicesResponse>(endpoint);
  },

  async read(externalId: string): Promise<Invoice> {
    return httpClient.get<Invoice>(`/invoices/${externalId}`);
  },

  async update(externalId: string, data: UpdateInvoiceRequest): Promise<Invoice> {
    return httpClient.patch<Invoice>(`/invoices/${externalId}`, data);
  },

  async partialUpdate(externalId: string, data: UpdateInvoiceRequest): Promise<Invoice> {
    return httpClient.patch<Invoice>(`/invoices/${externalId}`, data);
  },

  async delete(externalId: string): Promise<void> {
    await httpClient.delete(`/invoices/${externalId}`);
  },

  async close(externalId: string): Promise<Invoice> {
    return httpClient.post<Invoice>(`/invoices/${externalId}/close`, {});
  }
}); 