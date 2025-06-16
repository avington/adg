import { useQuery, QueryResult } from '@apollo/client';
import { LOTS_BY_PORTFOLIO_AND_SYMBOL } from '../queries/lots-by-portfolio-and-symbol';
import { LotProjection } from '@adg/server-domain-read-models';

interface LotsByPortfolioAndSymbolData {
  lotsByPortfolioAndSymbol: LotProjection[];
}

export const useLotsByPortfolioAndSymbol = (
  portfolioId: string,
  symbol: string,
  token: string
): QueryResult<LotsByPortfolioAndSymbolData> => {
  return useQuery<LotsByPortfolioAndSymbolData>(LOTS_BY_PORTFOLIO_AND_SYMBOL, {
    variables: { portfolioId, symbol },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
