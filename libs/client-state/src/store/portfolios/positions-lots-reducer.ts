import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PositionLots {
  positionId: string;
  symbol: string;
  totalShares: number;
  averagePrice: number;
  realizedGains: number;
  unrealizedGains: number;
  costBasis: number;
}

// State shape: { [portfolioId]: { [positionId]: PositionLots } }
export type PositionsLotsState = Record<string, Record<string, PositionLots>>;

const initialState: PositionsLotsState = {};

export const positionsLotsSlice = createSlice({
  name: 'positionsLots',
  initialState,
  reducers: {
    upsertPortfolioPositionsLots: (
      state,
      action: PayloadAction<{
        portfolioId: string;
        positions: PositionLots[];
      }>
    ) => {
      const { portfolioId, positions } = action.payload;
      if (!state[portfolioId]) state[portfolioId] = {};
      for (const p of positions) {
        state[portfolioId][p.positionId] = p;
      }
    },
    removePortfolioPositionLots: (
      state,
      action: PayloadAction<{ portfolioId: string; positionId: string }>
    ) => {
      const { portfolioId, positionId } = action.payload;
      if (state[portfolioId]) {
        delete state[portfolioId][positionId];
      }
    },
    resetPortfolioPositionsLots: (
      state,
      action: PayloadAction<{ portfolioId?: string } | undefined>
    ) => {
      const portfolioId = action?.payload?.portfolioId;
      if (!portfolioId) {
        // clear entire state object without returning a new reference
        for (const key of Object.keys(state)) {
          delete state[key];
        }
        return;
      }
      if (state[portfolioId]) {
        delete state[portfolioId];
      }
    },
  },
});

export const {
  upsertPortfolioPositionsLots,
  removePortfolioPositionLots,
  resetPortfolioPositionsLots,
} = positionsLotsSlice.actions;

export default positionsLotsSlice.reducer;
