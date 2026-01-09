import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchExchangeRate } from '../exchangeRate';

describe('exchangeRate', () => {
  describe('fetchExchangeRate', () => {
    const mockFetch = vi.fn();
    
    beforeEach(() => {
      vi.stubGlobal('fetch', mockFetch);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      mockFetch.mockReset();
    });

    it('should fetch and return exchange rate', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          base: 'USD',
          date: '2024-01-15',
          rates: { ILS: 3.65 },
        }),
      });

      const result = await fetchExchangeRate();
      
      expect(result.rate).toBe(3.65);
      expect(result.date).toBe('2024-01-15');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS'
      );
    });

    it('should throw error on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchExchangeRate()).rejects.toThrow('Failed to fetch exchange rate: 500');
    });

    it('should throw error when ILS rate is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          base: 'USD',
          date: '2024-01-15',
          rates: { EUR: 0.92 }, // No ILS
        }),
      });

      await expect(fetchExchangeRate()).rejects.toThrow('ILS rate not found in response');
    });

    it('should throw error when rates is undefined', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          base: 'USD',
          date: '2024-01-15',
          // rates is missing
        }),
      });

      await expect(fetchExchangeRate()).rejects.toThrow('ILS rate not found in response');
    });
  });
});
