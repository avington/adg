import {
  StockQuoteModel,
  SymbolSearchModel,
  CompanyProfileModel,
} from '@adg/global-models';
import axios from 'axios';

const FMP_API_KEY = process.env.FMP_API_KEY || 'demo';
const FMP_URL =
  process.env.FMP_URL || 'https://financialmodelingprep.com/stable/';

export async function searchSymbol(symbol: string): Promise<SymbolSearchModel> {
  const response = await axios.get(`${FMP_URL}/search`, {
    params: {
      apikey: FMP_API_KEY,
      query: symbol,
    },
  });
  return response.data;
}

/**
 * Retrieves the company profile for the given symbol.
 * The FMP API returns an array of profiles; this function returns the first profile in the array,
 * or null if no profiles are found. This behavior matches the API contract expectations.
 */
export async function getProfile(
  symbol: string
): Promise<CompanyProfileModel | null> {
  const response = await axios.get(`${FMP_URL}/profile`, {
    params: {
      apikey: FMP_API_KEY,
      symbol: symbol,
    },
  });
  return Array.isArray(response.data) && response.data.length > 0
    ? response.data[0]
    : null; // Safely return the first profile or null
}

export async function getQuote(
  symbol: string
): Promise<StockQuoteModel | null> {
  const response = await axios.get(`${FMP_URL}/quote`, {
    params: {
      apikey: FMP_API_KEY,
      symbol: symbol,
    },
  });
  if (Array.isArray(response.data) && response.data.length > 0) {
    return response.data[0];
  }
  return null; // Response structure did not match expectations
}

export interface StockQuoteShortModel {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

export async function getShortQuote(
  symbol: string
): Promise<StockQuoteShortModel | null> {
  const response = await axios.get(`${FMP_URL}/quote`, {
    params: {
      apikey: FMP_API_KEY,
      symbol,
    },
  });
  const arr = Array.isArray(response.data) ? response.data : [];
  if (!arr.length) return null;
  const first = arr[0] as {
    symbol: string;
    price: number;
    change: number;
    volume: number;
  };
  // Map the full quote to the short model fields we expose
  return {
    symbol: first.symbol,
    price: first.price,
    change: first.change,
    volume: first.volume,
  };
}

export async function getShortQuotes(
  symbols: string[]
): Promise<StockQuoteShortModel[]> {
  if (!symbols?.length) return [];
  console.log('Fetching short quotes for symbols:', symbols);
  // Use the batch endpoint and the 'symbols' query parameter per FMP docs
  const url = `${FMP_URL}/batch-quote-short`;
  const params = {
    apikey: FMP_API_KEY,
    symbols: symbols.join(','),
  } as const;
  console.log('Requesting batch short quotes:', {
    url,
    // Do not log the API key
    symbols: params.symbols,
  });

  let response;
  try {
    response = await axios.get(url, { params });
  } catch (error) {
    console.error('Error fetching batch short quotes:', error);
    return [];
  }
  console.log('Received short quotes response:', response.data);
  const arr = Array.isArray(response.data) ? response.data : [];
  return arr.filter(Boolean) as StockQuoteShortModel[];
}
