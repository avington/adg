import {
  useQuotesShort,
  useUserHoldingsSymbolsByPortfolio,
} from '@adg/client-graphql-data';
import {
  selectAllUniqueSymbols,
  setQuotes,
  setAllSymbols,
  setError,
  setLoadingState,
  useAppDispatch,
  useAppSelector,
} from '@adg/client-state';
import { useEffect } from 'react';

export const QuotesRefresher: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useUserHoldingsSymbolsByPortfolio({
    onCompleted: (data) => {
      if (data?.userHoldingsSymbolsByPortfolio) {
        dispatch(setAllSymbols(data?.userHoldingsSymbolsByPortfolio ?? []));
      }
    },
  });
  const allSymbols = useAppSelector(selectAllUniqueSymbols);
  const {
    data: quotesData,
    startPolling,
    stopPolling,
    refetch,
  } = useQuotesShort(allSymbols, {
    onCompleted: ({ quotesShort }) => {
      if (Array.isArray(quotesShort)) {
        dispatch(setQuotes(quotesShort));
      }
    },
  });

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

  useEffect(() => {
    const quotes = quotesData?.quotesShort;
    if (Array.isArray(quotes)) {
      dispatch(setQuotes(quotes));
    }
  }, [quotesData?.quotesShort, dispatch]);

  // Start polling for latest quotes every 60 seconds when we have symbols
  useEffect(() => {
    if (!allSymbols?.length) {
      // If symbols become empty, ensure polling stops
      stopPolling?.();
      return;
    }
    // Ensure an immediate fetch when symbols appear
    refetch?.({ symbols: allSymbols });
    // Start polling for latest quotes every 60 seconds when we have symbols
    startPolling?.(60000);
    return () => {
      stopPolling?.();
    };
  }, [allSymbols, startPolling, stopPolling, refetch]);

  return null;
};
