import { createInvoicesAPI } from './invoices';
import type { Invoice, ListInvoicesResponse } from '../types/invoices';

const mockInvoice: Invoice = {
  id: 'inv_123',
  open: true,
  price: '1000.00',
  currency: 'SEK',
  ocr_number: '123456789',
  pdf: 'https://example.com/invoice.pdf',
  metadata: {},
  created_at: '2024-02-28T12:00:00Z',
  paid_at: null,
  app: 'web',
  invoice_marking: null
};

const mockListResponse: ListInvoicesResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [mockInvoice]
};

const mockHttpClient = {
  get: jest.fn().mockImplementation((endpoint: string) => {
    if (endpoint.startsWith('/invoices/') && !endpoint.includes('?')) {
      return Promise.resolve(mockInvoice);
    }
    return Promise.resolve(mockListResponse);
  }),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn().mockImplementation((endpoint: string, data) => {
    return Promise.resolve({
      ...mockInvoice,
      ...data,
      metadata: { ...(mockInvoice.metadata || {}), ...(data.metadata || {}) }
    });
  }),
  delete: jest.fn()
};

describe('invoices resource', () => {
  const invoicesAPI = createInvoicesAPI(mockHttpClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch invoices without parameters', async () => {
      const response = await invoicesAPI.list();
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/invoices');
      expect(response).toEqual(mockListResponse);
    });

    it('should fetch invoices with pagination parameters', async () => {
      const options = { page: 2, page_size: 20 };
      await invoicesAPI.list(options);
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/invoices?page=2&page_size=20');
    });
  });

  describe('read', () => {
    it('should fetch an invoice by ID', async () => {
      const externalId = 'inv_123';
      const response = await invoicesAPI.read(externalId);
      
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/invoices/${externalId}`);
      expect(response).toEqual(mockInvoice);
    });
  });

  describe('update', () => {
    it('should update an invoice with metadata', async () => {
      const externalId = 'inv_123';
      const updateData = {
        metadata: { department: 'Engineering' }
      };
      
      const response = await invoicesAPI.update(externalId, updateData);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/invoices/${externalId}`, updateData);
      expect(response).toEqual({
        ...mockInvoice,
        metadata: { department: 'Engineering' }
      });
    });

    it('should update an invoice with invoice marking', async () => {
      const externalId = 'inv_123';
      const updateData = {
        invoice_marking: 'New marking'
      };
      
      await invoicesAPI.update(externalId, updateData);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/invoices/${externalId}`, updateData);
    });

    it('should update an invoice with null invoice marking', async () => {
      const externalId = 'inv_123';
      const updateData = {
        invoice_marking: null
      };
      
      await invoicesAPI.update(externalId, updateData);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/invoices/${externalId}`, updateData);
    });
  });

  describe('partialUpdate', () => {
    it('should partially update an invoice with metadata', async () => {
      const externalId = 'inv_123';
      const updateData = {
        metadata: { department: 'Engineering' }
      };
      
      const response = await invoicesAPI.partialUpdate(externalId, updateData);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/invoices/${externalId}`, updateData);
      expect(response).toEqual({
        ...mockInvoice,
        metadata: { department: 'Engineering' }
      });
    });

    it('should partially update an invoice with invoice marking', async () => {
      const externalId = 'inv_123';
      const updateData = {
        invoice_marking: 'New marking'
      };
      
      await invoicesAPI.partialUpdate(externalId, updateData);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/invoices/${externalId}`, updateData);
    });

    it('should partially update an invoice with null invoice marking', async () => {
      const externalId = 'inv_123';
      const updateData = {
        invoice_marking: null
      };
      
      await invoicesAPI.partialUpdate(externalId, updateData);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/invoices/${externalId}`, updateData);
    });

    it('should partially update an invoice with multiple fields', async () => {
      const externalId = 'inv_123';
      const updateData = {
        metadata: { department: 'Engineering' },
        invoice_marking: 'New marking'
      };
      
      await invoicesAPI.partialUpdate(externalId, updateData);
      
      expect(mockHttpClient.patch).toHaveBeenCalledWith(`/invoices/${externalId}`, updateData);
    });
  });

  describe('delete', () => {
    it('should delete an invoice by ID', async () => {
      const externalId = 'inv_123';
      
      await invoicesAPI.delete(externalId);
      
      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/invoices/${externalId}`);
    });
  });

  describe('close', () => {
    it('should close an invoice', async () => {
      const externalId = 'inv_123';
      const closedInvoice = { ...mockInvoice, open: false };
      mockHttpClient.post.mockResolvedValueOnce(closedInvoice);
      
      const response = await invoicesAPI.close(externalId);
      
      expect(mockHttpClient.post).toHaveBeenCalledWith(`/invoices/${externalId}/close`, {});
      expect(response).toEqual(closedInvoice);
    });
  });
}); 