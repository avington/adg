import { LoadingState } from '@adg/global-models';
import { UserHoldingsPortfolio } from '@adg/global-read-models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AllSymbolsState {
  symbols: UserHoldingsPortfolio[];
  loadingState: LoadingState;
  error?: string | null;
}

export const initialAllSymbolsState: AllSymbolsState = {
  symbols: [],
  loadingState: 'idle',
  error: null,
};

export const allSymbolsSlice = createSlice({
  name: 'allSymbols',
  initialState: initialAllSymbolsState,
  reducers: {
    setAllSymbols: (state, action: PayloadAction<UserHoldingsPortfolio[]>) => {
      state.symbols = action.payload;
      state.loadingState = 'loaded';
      state.error = null;
    },
    setLoadingState: (state, action: PayloadAction<LoadingState>) => {
      state.loadingState = action.payload;
    },
    setError: (state, action: PayloadAction<string | null | undefined>) => {
      state.error = action.payload ?? null;
      state.loadingState = 'error';
    },
  },
});

export const { setAllSymbols, setLoadingState, setError } =
  allSymbolsSlice.actions;
