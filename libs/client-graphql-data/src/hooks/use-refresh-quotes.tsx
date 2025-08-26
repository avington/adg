import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { USER_SYMBOLS } from '../queries/user-symbols';
import { QUOTES_SHORT } from '../queries/quotes-short';
import { useAppDispatch, updatePrice } from '@adg/client-state';

export const useRefreshQuotes = () => {
  const dispatch = useAppDispatch();
  const [loadSymbols, { data: symbolsData }] = useLazyQuery(USER_SYMBOLS);
  const [loadQuotes, { data: quotesData, loading, error }] =
    useLazyQuery(QUOTES_SHORT);

  useEffect(() => {
    loadSymbols();
  }, [loadSymbols]);

  useEffect(() => {
    const symbols = symbolsData?.userSymbols ?? [];
    if (symbols.length) {
      loadQuotes({ variables: { symbols } });
    }
  }, [symbolsData, loadQuotes]);

  useEffect(() => {
    const quotes = quotesData?.quotesShort ?? [];
    quotes.forEach((q: { symbol: string; price: number }) => {
      dispatch(updatePrice({ symbol: q.symbol, latestPrice: q.price }));
    });
  }, [quotesData, dispatch]);

  return { loading, error };
};
