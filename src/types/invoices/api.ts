import { Invoice, ListInvoicesResponse, UpdateInvoiceRequest } from './models';

export interface ListInvoicesOptions {
  /** Page number within the paginated result set */
  page?: number;
  /** Number of results to return per page */
  page_size?: number;
}

export interface InvoicesAPI {
  /**
   * List all invoices with optional pagination
   * @param options - Pagination options
   */
  list(options?: ListInvoicesOptions): Promise<ListInvoicesResponse>;

  /**
   * Get an invoice by its external ID
   * @param externalId - The external ID of the invoice
   */
  read(externalId: string): Promise<Invoice>;

  /**
   * Update an invoice by its external ID
   * @param externalId - The external ID of the invoice
   * @param data - The invoice data to update
   */
  update(externalId: string, data: UpdateInvoiceRequest): Promise<Invoice>;

  /**
   * Partially update an invoice by its external ID
   * @param externalId - The external ID of the invoice
   * @param data - The invoice data to partially update
   */
  partialUpdate(externalId: string, data: UpdateInvoiceRequest): Promise<Invoice>;

  /**
   * Delete an invoice by its external ID
   * @param externalId - The external ID of the invoice
   */
  delete(externalId: string): Promise<void>;

  /**
   * Close an open payrun invoice
   * @param externalId - The external ID of the invoice
   */
  close(externalId: string): Promise<Invoice>;
} 