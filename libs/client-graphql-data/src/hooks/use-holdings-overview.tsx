import { useQuery, QueryResult } from '@apollo/client';
import { PositionOverviewProjection } from '@adg/global-read-models';
import {
  POSITION_OVERVIEWS,
  POSITION_OVERVIEW,
} from '../queries/position-overview';

interface PositionOverviewsData {
  positionOverviews: PositionOverviewProjection[];
}

interface PositionOverviewData {
  positionOverview: PositionOverviewProjection | null;
}

export const usePositionOverviews = (
  portfolioId: string
): QueryResult<PositionOverviewsData> => {
  return useQuery<PositionOverviewsData>(POSITION_OVERVIEWS, {
    variables: { portfolioId },
    skip: !portfolioId,
  });
};

export const usePositionOverview = (
  positionId: string
): QueryResult<PositionOverviewData> => {
  return useQuery<PositionOverviewData>(POSITION_OVERVIEW, {
    variables: { positionId },
    skip: !positionId,
  });
};

// Convenience hook with better naming for holdings context
export const useHoldingsOverview = (
  portfolioId: string
): QueryResult<PositionOverviewsData> => {
  return usePositionOverviews(portfolioId);
};
