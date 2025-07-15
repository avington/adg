import { StockQuoteModel } from '../fmp/stock-quote.js';
import { SymbolSearchModel } from '../fmp/symbol-search.js';

export interface PositionOverviewModel {
  positionId: string;
  portfolioId: string;
  userId: string;
  symbol: string;
  summary: SymbolSearchModel;
  stockQuote: StockQuoteModel;
  createdAt: Date;
  updatedAt: Date;
}
