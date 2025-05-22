import React, { PropsWithChildren } from 'react';
import { GlobalThemeContext } from './global-theme-context';

export const GlobalThemeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [headerLeft, setHeaderLeft] = React.useState<React.ReactNode>(null);
  const [headerRight, setHeaderRight] = React.useState<React.ReactNode>(null);

  return (
    <GlobalThemeContext.Provider
      value={{
        headerLeft,
        setHeaderLeft,
        headerRight,
        setHeaderRight,
      }}
    >
      {children}
    </GlobalThemeContext.Provider>
  );
};
