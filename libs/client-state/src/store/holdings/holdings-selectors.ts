import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectHoldingsState = (state: RootState) => state.holdings;

export const selectHoldingBySymbol = (symbol: string) =>
  createSelector(selectHoldingsState, (holdings) => {
    const key = symbol.toUpperCase();
    return holdings[key] ?? null;
  });

export const selectAllHoldingsArray = createSelector(
  selectHoldingsState,
  (holdings) =>
    Object.entries(holdings).map(([symbol, h]) => ({
      symbol,
      ...h,
      marketValue: h.quantity * h.latestPrice,
      costBasis: h.quantity * h.averageCost,
      unrealizedGain: h.quantity * (h.latestPrice - h.averageCost),
    }))
);

export const selectTotals = createSelector(selectAllHoldingsArray, (rows) => {
  return rows.reduce(
    (acc, r) => {
      acc.marketValue += r.marketValue;
      acc.costBasis += r.costBasis;
      acc.unrealizedGain += r.unrealizedGain;
      return acc;
    },
    { marketValue: 0, costBasis: 0, unrealizedGain: 0 }
  );
});
