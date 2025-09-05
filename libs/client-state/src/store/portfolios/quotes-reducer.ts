import { QuoteShortItem } from '@adg/global-read-models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuotesState {
  [symbol: string]: QuoteShortItem;
}

const initialState: QuotesState = {};

export const quoteSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    setQuote: (state, action: PayloadAction<QuoteShortItem>) => {
      const { symbol } = action.payload;
      state[symbol] = action.payload;
    },
    setQuotes: (state, action: PayloadAction<QuoteShortItem[]>) => {
      // Replace the state with a new map keyed by symbol
      const next: QuotesState = {};
      for (const q of action.payload) {
        next[q.symbol] = q;
      }
      return next;
    },
    removeQuote: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const { setQuote, setQuotes, removeQuote } = quoteSlice.actions;
