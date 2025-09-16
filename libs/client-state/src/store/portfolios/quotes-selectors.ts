import { createSelector } from '@reduxjs/toolkit';
import { RootState, selectAllSymbols } from '..';
import { QuoteShortItem } from '@adg/global-read-models';

// Merged type: a portfolio with its resolved quotes
export interface PortfolioQuotes {
  portfolioId: string;
  portfolioName?: string | null;
  quotes: QuoteShortItem[];
}

// Plain input selector: avoid identity-return pattern that triggers RTK checks
export const selectAllQuotes = (root: RootState) => root.quotes;

export const selectQuotesByPortfolio = createSelector(
  selectAllQuotes,
  selectAllSymbols,
  (quotes, allSymbols) => {
    const symbolList = allSymbols.flatMap((p) => p.symbols);
    const portfolioQuotes = Object.keys(quotes)
      .filter((symbol) => symbolList.includes(symbol))
      .map((symbol) => quotes[symbol]);
    return portfolioQuotes;
  }
);

// Group quotes by portfolio using the symbols list from selectAllSymbols
export const selectPortfoliosWithQuotes = createSelector(
  (root: RootState) => root.quotes,
  selectAllSymbols,
  (quotesMap, portfolios): PortfolioQuotes[] =>
    portfolios.map((p) => ({
      portfolioId: p.portfolioId,
      portfolioName: p.portfolioName,
      quotes: p.symbols
        .map((sym) => quotesMap[sym])
        .filter(Boolean) as QuoteShortItem[],
    }))
);
