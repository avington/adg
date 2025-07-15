import { StockQuoteModel, SymbolSearchModel } from '@adg/global-models';
import axios from 'axios';

const FMP_API_KEY = process.env.FMP_API_KEY || 'demo';
const FMP_URL =
  process.env.FMP_URL || 'https://financialmodelingprep.com/stable/';

export async function searchSymbol(symbol: string): Promise<SymbolSearchModel> {
  const response = await axios.get(`${FMP_URL}/search`, {
    params: {
      api_key: FMP_API_KEY,
      query: symbol,
    },
  });
  return response.data;
}

export async function getQuote(symbol: string): Promise<StockQuoteModel> {
  const response = await axios.get(`${FMP_URL}/quote`, {
    params: {
      api_key: FMP_API_KEY,
      symbol: symbol,
    },
  });
  return response.data;
}
