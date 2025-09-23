import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectPositionsLotsState = (state: RootState) =>
  state.positionsLots;

export const selectPortfolioPositionsLots = (portfolioId: string) =>
  createSelector(selectPositionsLotsState, (state) => {
    const map = state[portfolioId] ?? {};
    return Object.values(map);
  });

export const selectPortfolioTotals = (portfolioId: string) =>
  createSelector(selectPortfolioPositionsLots(portfolioId), (rows) => {
    return rows.reduce(
      (acc, r) => {
        acc.totalShares += r.totalShares ?? 0;
        acc.totalCostBasis += r.costBasis ?? 0;
        return acc;
      },
      { totalShares: 0, totalCostBasis: 0 }
    );
  });

// Quotes map input selector
const selectQuotesMap = (root: RootState) => root.quotes;

// Derived totals used by UI components
export const selectPortfolioCostBasis = (portfolioId: string) =>
  createSelector(selectPortfolioPositionsLots(portfolioId), (rows) =>
    rows.reduce(
      (acc, p) => acc + (p.totalShares ?? 0) * (p.averagePrice ?? 0),
      0
    )
  );

export const selectPortfolioMarketValue = (portfolioId: string) =>
  createSelector(
    selectPortfolioPositionsLots(portfolioId),
    selectQuotesMap,
    (rows, quotes) =>
      rows.reduce(
        (acc, p) => acc + (p.totalShares ?? 0) * (quotes[p.symbol]?.price ?? 0),
        0
      )
  );

export const selectPortfolioUnrealizedGains = (portfolioId: string) =>
  createSelector(selectPortfolioPositionsLots(portfolioId), (rows) =>
    rows.reduce((acc, p) => acc + (p.unrealizedGains ?? 0), 0)
  );

export const selectPortfolioRealizedGains = (portfolioId: string) =>
  createSelector(selectPortfolioPositionsLots(portfolioId), (rows) =>
    rows.reduce((acc, p) => acc + (p.realizedGains ?? 0), 0)
  );

export const selectPortfolioTotalGains = (portfolioId: string) =>
  createSelector(
    selectPortfolioUnrealizedGains(portfolioId),
    selectPortfolioRealizedGains(portfolioId),
    (unrealized, realized) => unrealized + realized
  );

export const selectPortfolioDailyChange = (portfolioId: string) =>
  createSelector(
    selectPortfolioPositionsLots(portfolioId),
    selectQuotesMap,
    (rows, quotes) =>
      rows.reduce(
        (acc, p) =>
          acc + (p.totalShares ?? 0) * (quotes[p.symbol]?.change ?? 0),
        0
      )
  );
