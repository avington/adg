import { useQuery, QueryHookOptions } from '@apollo/client';
import { USER_HOLDINGS_SYMBOLS_BY_PORTFOLIO } from '../queries';
import { UserHoldingsPortfolio } from '@adg/global-read-models';

type QueryResult = {
  userHoldingsSymbolsByPortfolio: UserHoldingsPortfolio[];
};

export function useUserHoldingsSymbolsByPortfolio(
  options?: QueryHookOptions<QueryResult>
) {
  const query = useQuery<QueryResult>(
    USER_HOLDINGS_SYMBOLS_BY_PORTFOLIO,
    options
  );

  return {
    ...query,
    portfolios: query.data?.userHoldingsSymbolsByPortfolio ?? [],
  };
}
