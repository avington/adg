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

export const QuotesRefresher: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, data, error } = useUserHoldingsSymbolsByPortfolio({});
  const allSymbols = useAppSelector(selectAllUniqueSymbols);

  useEffect(() => {
    if (data?.userHoldingsSymbolsByPortfolio) {
      // const allSymbols = useAppSelector(selectAllUniqueSymbols);
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
