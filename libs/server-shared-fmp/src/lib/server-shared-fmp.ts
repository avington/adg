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
