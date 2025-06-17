import { useQuery, QueryResult } from '@apollo/client';
import { LOTS_BY_PORTFOLIO_AND_SYMBOL } from '../queries/lots-by-portfolio-and-symbol';
import { LotProjection } from '@adg/server-domain-read-models';

interface LotsByPortfolioAndSymbolData {
  lots: LotProjection[];
}

export const useLotsByPortfolioAndSymbol = (
  portfolioId: string,
  symbol: string
): QueryResult<LotsByPortfolioAndSymbolData> => {
  return useQuery<LotsByPortfolioAndSymbolData>(LOTS_BY_PORTFOLIO_AND_SYMBOL, {
    variables: { portfolioId, symbol },
  });
};
