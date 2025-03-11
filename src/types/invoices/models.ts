/**
 * Single invoice entity returned by the API
 */
export interface Invoice {
  /** Invoice ID */
  id: string;
  /** Whether the invoice is open */
  open: boolean;
  /** Price in decimal format */
  price: string;
  /** Currency code */
  currency: string;
  /** OCR number */
  ocr_number: string;
  /** PDF URL */
  pdf?: string;
  /** Invoice metadata */
  metadata: Record<string, unknown>;
  /** Creation timestamp */
  created_at: string;
  /** Payment timestamp */
  paid_at: string | null;
  /** App identifier */
  app: string;
  /** Invoice marking */
  invoice_marking: string | null;
}

/**
 * Request body for updating an invoice
 */
export interface UpdateInvoiceRequest {
  /** Optional metadata object */
  metadata?: Record<string, unknown>;
  /** Optional invoice marking (max 256 characters) */
  invoice_marking?: string | null;
}

/**
 * Response for listing invoices
 */
export interface ListInvoicesResponse {
  /** Total count of invoices */
  count: number;
  /** URL to next page of results */
  next: string | null;
  /** URL to previous page of results */
  previous: string | null;
  /** Array of invoice results */
  results: Invoice[];
} 