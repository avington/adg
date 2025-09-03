import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const selectAllSymbolsLoadingState = createSelector(
  (root: RootState) => root.allSymbols,
  (state) => state.loadingState
);

export const selectAllSymbolsError = createSelector(
  (root: RootState) => root.allSymbols,
  (state) => state.error
);

export const selectAllSymbols = createSelector(
  (root: RootState) => root.allSymbols,
  (state) => state.symbols
);

export const selectAllUniqueSymbols = createSelector(selectAllSymbols, (sp) =>
  [...new Set(sp.flatMap((p) => p.symbols))].sort()
);
