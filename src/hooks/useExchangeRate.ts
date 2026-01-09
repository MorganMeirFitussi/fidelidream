import { useState, useCallback } from 'react';
import { fetchExchangeRate as fetchRate } from '../utils/exchangeRate';

interface UseExchangeRateReturn {
  isLoading: boolean;
  date: string | null;
  error: string | null;
  fetch: () => Promise<number | null>;
}

/**
 * Hook for fetching USD/ILS exchange rate from Frankfurter API
 * @returns Loading state, date, error, and fetch function
 */
export function useExchangeRate(): UseExchangeRateReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (): Promise<number | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchRate();
      setDate(result.date);
      return result.rate;
    } catch (err) {
      setError('Failed to fetch rate');
      console.error('Exchange rate fetch error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, date, error, fetch };
}
