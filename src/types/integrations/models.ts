/**
 * Integration type enum (1, 2, or 3)
 */
export enum IntegrationType {
  Type1 = 1,
  Type2 = 2,
  Type3 = 3,
}

/**
 * Integration entity returned by the API
 */
export interface Integration {
  /** UUID of the integration */
  id: string;
  /** Type of integration (1, 2, or 3) */
  type: number;
  /** Name as seen by users (1-255 characters) */
  name: string;
  /** Optional metadata object */
  metadata: Record<string, unknown>;
  /** Email we'll send invoice and receipts to */
  email: string;
  /** Name written on invoices and post */
  recipient: string;
  /** First line of address (1-255 characters) */
  address_line_1: string;
  /** Optional second address line (<= 255 characters) */
  address_line_2?: string;
  /** Zip code (1-8 characters) */
  zip_code: string;
  /** City (1-255 characters) */
  city: string;
  /** Optional logo URL */
  logo?: string;
  /** Whether international payouts are enabled */
  international_payouts: boolean;
  /** Countries where payouts are allowed */
  allowed_payout_countries: string;
}

/**
 * Request body schema for creating an integration
 */
export interface CreateIntegrationRequest {
  /** Integration type (1, 2, or 3) */
  type: IntegrationType;
  /** Name as seen by users, 1-255 characters */
  name: string;
  /** Optional metadata object */
  metadata?: Record<string, any>;
  /** Email where Invoice and Receipts will be sent, ≤ 254 characters */
  email: string;
  /** Name written on invoices and post, 1-255 characters */
  recipient: string;
  /** Primary address line, 1-255 characters */
  address_line_1: string;
  /** Optional second address line, ≤ 255 characters */
  address_line_2?: string | null;
  /** Zip code, 1-5 characters */
  zip_code: string;
  /** City name, 1-255 characters */
  city: string;
  /** Optional logo URL */
  logo?: string;
  /** Whether international payouts are enabled */
  international_payouts?: boolean;
  /** Allowed payout countries */
  allowed_payout_countries?: string;
} 