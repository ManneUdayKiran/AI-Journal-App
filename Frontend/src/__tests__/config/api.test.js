import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '../../config/api';

describe('API Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('API_BASE_URL', () => {
    it('should be defined', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
    });

    it('should end with /api', () => {
      expect(API_BASE_URL.endsWith('/api')).toBe(true);
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have login endpoint', () => {
      expect(API_ENDPOINTS.login).toBeDefined();
      expect(API_ENDPOINTS.login).toContain('/auth/login');
    });

    it('should have signup endpoint', () => {
      expect(API_ENDPOINTS.signup).toBeDefined();
      expect(API_ENDPOINTS.signup).toContain('/auth/signup');
    });

    it('should have journal endpoints', () => {
      expect(API_ENDPOINTS.createEntry).toBeDefined();
      expect(API_ENDPOINTS.getAllEntries).toBeDefined();
      expect(typeof API_ENDPOINTS.editEntry).toBe('function');
      expect(typeof API_ENDPOINTS.deleteEntry).toBe('function');
    });

    it('should generate correct edit entry URL', () => {
      const id = '12345';
      const editUrl = API_ENDPOINTS.editEntry(id);
      expect(editUrl).toContain(`/journal/edit/${id}`);
    });

    it('should generate correct delete entry URL', () => {
      const id = '67890';
      const deleteUrl = API_ENDPOINTS.deleteEntry(id);
      expect(deleteUrl).toContain(`/journal/delete/${id}`);
    });
  });

  describe('getAuthHeaders', () => {
    it('should return headers with Authorization when token exists', () => {
      localStorage.getItem.mockReturnValue('test-token');
      
      const headers = getAuthHeaders();
      
      expect(headers.Authorization).toBe('Bearer test-token');
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should return headers with null token when no token exists', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const headers = getAuthHeaders();
      
      expect(headers.Authorization).toBe('Bearer null');
      expect(headers['Content-Type']).toBe('application/json');
    });
  });
});
