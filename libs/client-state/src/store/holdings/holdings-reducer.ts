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
      const key = symbol.toUpperCase();
      const existing = state[key];
      state[key] = {
        positionId,
        quantity,
        averageCost,
        latestPrice,
        ...(existing ? {} : {}),
      };
    },
    updatePrice: (
      state,
      action: PayloadAction<{ symbol: string; latestPrice: number }>
    ) => {
      const key = action.payload.symbol.toUpperCase();
      const existing = state[key];
      state[key] = {
        positionId: existing?.positionId ?? '',
        quantity: existing?.quantity ?? 0,
        averageCost: existing?.averageCost ?? 0,
        latestPrice: action.payload.latestPrice,
      };
    },
    removeHolding: (state, action: PayloadAction<{ symbol: string }>) => {
      const key = action.payload.symbol.toUpperCase();
      delete state[key];
    },
    resetHoldings: () => initialState,
  },
});

export const { upsertHolding, updatePrice, removeHolding, resetHoldings } =
  holdingsSlice.actions;

export default holdingsSlice.reducer;
