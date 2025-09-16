import {
  useQuotesShort,
  useUserHoldingsSymbolsByPortfolio,
} from '@adg/client-graphql-data';
import { useLazyQuery } from '@apollo/client';
import { QUOTES_SHORT } from '@adg/client-graphql-data';
import { isMarketOpenNow } from '@adg/global-formulas';
import {
  selectAllUniqueSymbols,
  setQuotes,
  setQuote,
  setAllSymbols,
  setError,
  setLoadingState,
  useAppDispatch,
  useAppSelector,
} from '@adg/client-state';
import { useEffect, useRef } from 'react';

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
  console.log('All symbols for quotes:', allSymbols);
  const { data: quotesData, stopPolling } = useQuotesShort(allSymbols, {
    // Ensure we hit the network for live quotes when polling
    fetchPolicy: 'network-only',
  });

  // Lazy query for per-symbol updates
  const [fetchOne] = useLazyQuery(QUOTES_SHORT, {
    fetchPolicy: 'network-only',
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
    if (!Array.isArray(quotes)) return;
    if (quotes.length > 1) {
      dispatch(setQuotes(quotes));
    } else if (quotes.length === 1) {
      dispatch(setQuote(quotes[0]));
    }
  }, [quotesData?.quotesShort, dispatch]);

  // Track timers per symbol to stagger requests
  const timersRef = useRef<Record<string, number>>({});
  const symbolsKeyRef = useRef<string>('');

  // Randomized per-symbol refresh between 3 and 5 minutes
  useEffect(() => {
    const key = Array.isArray(allSymbols) ? allSymbols.join('|') : '';

    // Cleanup any existing timers if symbol set changed
    const clearAllTimers = () => {
      Object.values(timersRef.current).forEach((id) => clearTimeout(id));
      timersRef.current = {};
    };

    if (!allSymbols?.length) {
      clearAllTimers();
      stopPolling?.();
      symbolsKeyRef.current = '';
      return;
    }

    // Helper to get 3-5 minutes randomly in ms
    const nextDelay = () => {
      const min = 3 * 60_000; // 3 minutes
      const max = 5 * 60_000; // 5 minutes
      return Math.floor(min + Math.random() * (max - min));
    };

    // Cache market status and refresh every minute
    const marketStatusRef = { current: isMarketOpenNow() };
    let marketStatusTimer: number | undefined;

    const refreshMarketStatus = () => {
      marketStatusRef.current = isMarketOpenNow();
      marketStatusTimer = window.setTimeout(refreshMarketStatus, 60_000);
    };
    refreshMarketStatus();

    // Schedule a fetch for a single symbol
    const schedule = (symbol: string) => {
      const run = async () => {
        // Only fetch quotes during market hours to avoid unnecessary API calls.
        // If the market is closed, skip fetching and reschedule the next refresh.

        if (!marketStatusRef.current) {
          // Reschedule next refresh without fetching
          timersRef.current[symbol] = window.setTimeout(
            () => schedule(symbol),
            nextDelay()
          );
          return;
        }
        try {
          const result = await fetchOne({ variables: { symbols: [symbol] } });
          const one = result?.data?.quotesShort?.[0];
          if (one) dispatch(setQuote(one));
        } catch {
          // swallow; we'll retry on next interval
        } finally {
          // reschedule next refresh
          timersRef.current[symbol] = window.setTimeout(
            () => schedule(symbol),
            nextDelay()
          );
        }
      };
      // kick off immediately for first run
      run();
    };

    // Start timers for each symbol, with a small initial random spread (0-5s) to avoid bursts
    allSymbols.forEach((sym) => {
      if (timersRef.current[sym]) return; // already scheduled
      const initialJitter = Math.floor(Math.random() * 5000);
      timersRef.current[sym] = window.setTimeout(
        () => schedule(sym),
        initialJitter
      );
    });

    symbolsKeyRef.current = key;

    return () => {
      clearAllTimers();
      stopPolling?.();
      if (marketStatusTimer) clearTimeout(marketStatusTimer);
    };
  }, [allSymbols, fetchOne, dispatch, stopPolling]);

  return null;
};
