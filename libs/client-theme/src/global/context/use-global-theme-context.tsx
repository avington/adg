import React from 'react';
import {
  GlobalThemeContext,
  GlobalThemeContextProps,
} from './global-theme-context';

export const useGlobalThemeContext = () => {
  const context = React.useContext<GlobalThemeContextProps | null>(
    GlobalThemeContext
  );
  if (!context) {
    throw new Error(
      'useGlobalThemeContext must be used within a GlobalThemeContextProvider'
    );
  }
  return context;
};
