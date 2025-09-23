import { useEffect, useMemo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { PORTFOLIO_BY_USER } from '../queries/portfolios';
import { POSITION_OVERVIEWS } from '../queries/position-overview';
import {
  upsertPortfolioPositionsLots,
  useAppDispatch,
} from '@adg/client-state';

interface PositionOverviewNode {
  id: string;
  positionId: string;
  portfolioId: string;
  symbol: string;
  lots?: {
    portfolioId: string;
    positionId: string;
    totalShares: number;
    averagePrice: number;
    realizedGains: number;
    unrealizedGains: number;
    costBasis: number;
  } | null;
}

interface PortfolioNode {
  portfolioId: string;
  name?: string;
  description?: string;
}

export const useLoadAllPositionsLots = () => {
  const dispatch = useAppDispatch();

  // 1) Load all portfolios for the user
  const {
    data: portfoliosData,
    loading: portfoliosLoading,
    error: portfoliosError,
  } = useQuery(PORTFOLIO_BY_USER);

  const portfolioIds: string[] = useMemo(
    () =>
      (portfoliosData?.portfolios as PortfolioNode[] | undefined)?.map(
        (p) => p.portfolioId
      ) ?? [],
    [portfoliosData]
  );

  // 2) Prepare lazy query for position overviews by portfolio
  const [loadPositionOverviews, { loading, error }] =
    useLazyQuery(POSITION_OVERVIEWS);

  // 3) When portfolios are available, fan out one query per portfolio and dispatch results on completion
  useEffect(() => {
    if (!portfolioIds.length || !portfoliosData) return;
    portfolioIds.forEach((id) => {
      loadPositionOverviews({
        variables: { portfolioId: id },
        onCompleted: (res) => {
          const pos: PositionOverviewNode[] = res?.positionOverviews ?? [];
          const positions = pos.map((p) => ({
            positionId: p.positionId,
            symbol: p.symbol,
            totalShares: p.lots?.totalShares ?? 0,
            averagePrice: p.lots?.averagePrice ?? 0,
            realizedGains: p.lots?.realizedGains ?? 0,
            unrealizedGains: p.lots?.unrealizedGains ?? 0,
            costBasis: p.lots?.costBasis ?? 0,
          }));
          dispatch(
            upsertPortfolioPositionsLots({ portfolioId: id, positions })
          );
        },
      });
    });
  }, [portfolioIds, portfoliosData, loadPositionOverviews, dispatch]);

  return {
    loading: portfoliosLoading || loading,
    error: portfoliosError || error,
    portfolioIds,
  };
};
