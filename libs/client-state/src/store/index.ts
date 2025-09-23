/// <reference types="vite/client" />

import {
  configureStore,
  createListenerMiddleware,
  TypedStartListening,
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { holdingsSlice } from './holdings/holdings-reducer';
import { allSymbolsSlice } from './portfolios/all-symbols-reducer';
import { quoteSlice } from './portfolios/quotes-reducer';
import { positionsLotsSlice } from './portfolios/positions-lots-reducer';

// Slice reducers
const reducer = {
  holdings: holdingsSlice.reducer,
  allSymbols: allSymbolsSlice.reducer,
  quotes: quoteSlice.reducer,
  positionsLots: positionsLotsSlice.reducer,
};

// Listener middleware (optional – extend as needed)
const listenerMiddleware = createListenerMiddleware();

// Actual Redux store (was previously a plain object causing the type error)
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './holdings/holdings-reducer';
export * from './holdings/holdings-selectors';

export * from './portfolios/all-symbols-reducer';
export * from './portfolios/all-symbols-selectors';

export * from './portfolios/quotes-reducer';
export * from './portfolios/quotes-selectors';
export * from './portfolios/positions-lots-reducer';
export * from './portfolios/positions-lots-selectors';
