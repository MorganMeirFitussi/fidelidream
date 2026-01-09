import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useExchangeRate } from '../useExchangeRate';

// Mock the fetchExchangeRate function
vi.mock('../../utils/exchangeRate', () => ({
  fetchExchangeRate: vi.fn(),
}));

import { fetchExchangeRate } from '../../utils/exchangeRate';

describe('useExchangeRate', () => {
  const mockFetch = vi.mocked(fetchExchangeRate);

  beforeEach(() => {
    mockFetch.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useExchangeRate());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.date).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch exchange rate successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      rate: 3.65,
      date: '2024-01-15',
    });

    const { result } = renderHook(() => useExchangeRate());
    
    let fetchedRate: number | null = null;
    await act(async () => {
      fetchedRate = await result.current.fetch();
    });

    expect(fetchedRate).toBe(3.65);
    expect(result.current.date).toBe('2024-01-15');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useExchangeRate());
    
    let fetchedRate: number | null = null;
    await act(async () => {
      fetchedRate = await result.current.fetch();
    });

    expect(fetchedRate).toBeNull();
    expect(result.current.error).toBe('Failed to fetch rate');
    expect(result.current.isLoading).toBe(false);
  });

  it('should set loading state during fetch', async () => {
    let resolvePromise: (value: { rate: number; date: string }) => void;
    const pendingPromise = new Promise<{ rate: number; date: string }>((resolve) => {
      resolvePromise = resolve;
    });
    mockFetch.mockReturnValueOnce(pendingPromise);

    const { result } = renderHook(() => useExchangeRate());
    
    act(() => {
      result.current.fetch();
    });

    // Should be loading while waiting
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!({ rate: 3.65, date: '2024-01-15' });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should clear error on new fetch', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useExchangeRate());
    
    // First fetch fails
    await act(async () => {
      await result.current.fetch();
    });
    
    expect(result.current.error).toBe('Failed to fetch rate');

    // Second fetch succeeds
    mockFetch.mockResolvedValueOnce({
      rate: 3.65,
      date: '2024-01-15',
    });

    await act(async () => {
      await result.current.fetch();
    });

    expect(result.current.error).toBeNull();
  });
});
