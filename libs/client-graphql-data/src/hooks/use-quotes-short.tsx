import { QueryHookOptions, QueryResult, useQuery } from '@apollo/client';
import { QUOTES_SHORT } from '../queries/quotes-short';
import { QuoteShortItem } from '@adg/global-read-models';

export interface QuotesShortData {
  quotesShort: QuoteShortItem[];
}

export interface QuotesShortVars {
  symbols: string[];
}

// Fetch short quotes for the given set of symbols
export const useQuotesShort = (
  symbols: string[],
  options?: QueryHookOptions<QuotesShortData, QuotesShortVars>
): QueryResult<QuotesShortData, QuotesShortVars> => {
  return useQuery<QuotesShortData, QuotesShortVars>(QUOTES_SHORT, {
    variables: { symbols },
    skip: !symbols || symbols.length === 0,
    notifyOnNetworkStatusChange: true,
    ...options,
  });
};
