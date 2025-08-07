import { useQuery, QueryResult } from '@apollo/client';
import { PortfolioProjection } from '@adg/global-read-models';
import { PORTFOLIO_BY_USER } from '../queries';

export interface PortfolioByUserData {
  portfolios: PortfolioProjection[];
}

export const useAllPortfolios = (): QueryResult<PortfolioByUserData> => {
  return useQuery<PortfolioByUserData>(PORTFOLIO_BY_USER);
};
