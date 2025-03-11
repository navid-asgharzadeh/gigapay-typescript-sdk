import { createIntegrationsAPI } from './integrations';
import { Integration, IntegrationType } from '../types/integrations';

const mockIntegration: Integration = {
  id: 'e6b68124-9f69-4e61-8cce-679477396e02',
  type: IntegrationType.Type1,
  name: 'Test Integration',
  metadata: {},
  email: 'test@example.com',
  recipient: 'Test Company AB',
  address_line_1: 'Test Street 123',
  address_line_2: 'Floor 4',
  zip_code: '12345',
  city: 'Stockholm',
  logo: 'https://example.com/logo.png',
  international_payouts: true,
  allowed_payout_countries: 'SWE,NOR,DNK'
};

const mockListResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [mockIntegration]
};

const mockHttpClient = {
  get: jest.fn().mockImplementation((endpoint: string) => {
    if (endpoint.startsWith('/integrations/') && !endpoint.includes('?')) {
      return Promise.resolve(mockIntegration);
    }
    return Promise.resolve(mockListResponse);
  }),
  post: jest.fn().mockResolvedValue(mockIntegration),
  put: jest.fn().mockResolvedValue(mockIntegration),
  patch: jest.fn().mockResolvedValue(mockIntegration),
  delete: jest.fn().mockResolvedValue(undefined)
};

describe('integrations resource', () => {
  const integrationsAPI = createIntegrationsAPI(mockHttpClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should fetch integrations without parameters', async () => {
      const response = await integrationsAPI.list();
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/integrations');
      expect(response).toEqual(mockListResponse);
    });

    it('should fetch integrations with pagination parameters', async () => {
      const options = { page: 2, perPage: 20 };
      await integrationsAPI.list(options);
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/integrations?offset=20&limit=20');
    });

    it('should fetch integrations with type filter', async () => {
      const options = { type: IntegrationType.Type1 };
      await integrationsAPI.list(options);
      
      expect(mockHttpClient.get).toHaveBeenCalledWith('/integrations?type=1');
    });
  });

  describe('create', () => {
    it('should create a new integration', async () => {
      const createData = {
        type: IntegrationType.Type1,
        name: 'New Integration',
        email: 'new@example.com',
        recipient: 'New Company AB',
        address_line_1: 'New Street 123',
        zip_code: '12345',
        city: 'Stockholm'
      };

      const response = await integrationsAPI.create(createData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/integrations', createData);
      expect(response).toEqual(mockIntegration);
    });
  });

  describe('read', () => {
    it('should fetch an integration by ID', async () => {
      const id = 'e6b68124-9f69-4e61-8cce-679477396e02';
      const response = await integrationsAPI.read(id);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/integrations/${id}`);
      expect(response).toEqual(mockIntegration);
    });
  });

  describe('update', () => {
    it('should update an integration', async () => {
      const id = 'e6b68124-9f69-4e61-8cce-679477396e02';
      const updateData = {
        name: 'Updated Integration',
        email: 'updated@example.com'
      };

      const response = await integrationsAPI.update(id, updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/integrations/${id}`, updateData);
      expect(response).toEqual(mockIntegration);
    });
  });

  describe('delete', () => {
    it('should delete an integration', async () => {
      const id = 'e6b68124-9f69-4e61-8cce-679477396e02';
      await integrationsAPI.delete(id);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/integrations/${id}`);
    });
  });
}); 