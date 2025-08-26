import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Holding {
  positionId: string;
  quantity: number;
  averageCost: number;
  latestPrice: number;
}

export type HoldingsState = Record<string, Holding>; // key = symbol (uppercase)

const initialState: HoldingsState = {};

export const holdingsSlice = createSlice({
  name: 'holdings',
  initialState,
  reducers: {
    upsertHolding: (
      state,
      action: PayloadAction<{
        symbol: string;
        positionId: string;
        quantity: number;
        averageCost: number;
        latestPrice: number;
      }>
    ) => {
      const { symbol, positionId, quantity, averageCost, latestPrice } =
        action.payload;
      state[symbol.toUpperCase()] = {
        positionId,
        quantity,
        averageCost,
        latestPrice,
      };
    },
    updatePrice: (
      state,
      action: PayloadAction<{ symbol: string; latestPrice: number }>
    ) => {
      const { symbol, latestPrice } = action.payload;
      const key = symbol.toUpperCase();
      const existing = state[key];
      if (existing) {
        existing.latestPrice = latestPrice;
      }
    },
    removeHolding: (state, action: PayloadAction<{ symbol: string }>) => {
      delete state[action.payload.symbol.toUpperCase()];
    },
    resetHoldings: () => initialState,
  },
});

export const { upsertHolding, updatePrice, removeHolding, resetHoldings } =
  holdingsSlice.actions;

export default holdingsSlice.reducer;
