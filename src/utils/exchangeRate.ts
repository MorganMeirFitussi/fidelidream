// Frankfurter API - Free currency exchange rate API
// No API key required, no rate limits, CORS-enabled
const FRANKFURTER_API = 'https://api.frankfurter.dev/v1/latest';

interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

interface FetchExchangeRateResult {
  rate: number;
  date: string;
}

/**
 * Fetches the current USD/ILS exchange rate from Frankfurter API
 * @returns Promise with rate and date
 * @throws Error if fetch fails or rate not found
 */
export async function fetchExchangeRate(): Promise<FetchExchangeRateResult> {
  const url = `${FRANKFURTER_API}?base=USD&symbols=ILS`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rate: ${response.status}`);
  }
  
  const data: ExchangeRateResponse = await response.json();
  
  if (!data.rates?.ILS) {
    throw new Error('ILS rate not found in response');
  }
  
  return {
    rate: data.rates.ILS,
    date: data.date,
  };
}
