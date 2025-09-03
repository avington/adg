import { useUserHoldingsSymbolsByPortfolio } from '@adg/client-graphql-data';
import {
  selectAllUniqueSymbols,
  setAllSymbols,
  setError,
  setLoadingState,
  useAppDispatch,
  useAppSelector,
} from '@adg/client-state';
import { useEffect } from 'react';

export interface QuotesRefresherProps {
  loading: boolean;
}

export const QuotesRefresher: React.FC<QuotesRefresherProps> = () => {
  const dispatch = useAppDispatch();
  const { loading, data, error } = useUserHoldingsSymbolsByPortfolio({});
  const allSymbols = useAppSelector(selectAllUniqueSymbols);
  console.log('QuotesRefresher render, allSymbols:', allSymbols);

  useEffect(() => {
    if (data?.userHoldingsSymbolsByPortfolio) {
      // Trigger a refresh of the quotes
      dispatch(setAllSymbols(data?.userHoldingsSymbolsByPortfolio ?? []));
    }
  }, [data?.userHoldingsSymbolsByPortfolio, dispatch]);

  useEffect(() => {
    if (loading) {
      dispatch(setLoadingState('loading'));
    }
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setError(error.message));
    }
  }, [error, dispatch]);

  return null;
};
