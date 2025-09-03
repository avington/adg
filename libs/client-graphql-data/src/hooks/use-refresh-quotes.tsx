import { updatePrice, useAppDispatch } from '@adg/client-state';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { QUOTES_SHORT } from '../queries/quotes-short';

export const useRefreshQuotes = (symbols: string[]) => {
  const dispatch = useAppDispatch();

  const [loadQuotes, { data: quotesData, loading, error }] =
    useLazyQuery(QUOTES_SHORT);

  useEffect(() => {
    if (symbols?.length) {
      loadQuotes({ variables: { symbols } });
    }
  }, [symbols, loadQuotes]);

  useEffect(() => {
    const quotes = quotesData?.quotesShort ?? [];
    quotes.forEach((q: { symbol: string; price: number }) => {
      dispatch(updatePrice({ symbol: q.symbol, latestPrice: q.price }));
    });
  }, [quotesData, dispatch]);

  return { loading, error };
};
