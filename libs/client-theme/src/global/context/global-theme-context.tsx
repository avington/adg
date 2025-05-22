import React from 'react';

export interface GlobalThemeContextProps {
  headerLeft: React.ReactNode;
  setHeaderLeft: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  headerRight: React.ReactNode;
  setHeaderRight: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

export const GlobalThemeContext =
  React.createContext<GlobalThemeContextProps | null>(null);
