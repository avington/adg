import { UserModel } from '@adg/global-models';
import { PositionOverviewProjection } from '@adg/server-domain-read-models';
import { AuthenticationError } from 'apollo-server-errors';
import type { Db } from 'mongodb';

// Define the GraphQL context type
interface GraphQLContext {
  db: Db;
  user?: UserModel;
}

// Define resolver argument types
interface PositionOverviewArgs {
  positionId: string;
}

interface PositionOverviewsArgs {
  portfolioId: string;
}

export default {
  Query: {
    async positionOverview(
      _parent: unknown,
      { positionId }: PositionOverviewArgs,
      context: GraphQLContext
    ) {
      // Filter by authenticated user's sub property
      const userSub = context.user?.sub;
      if (!userSub) {
        throw new AuthenticationError('User not authenticated');
      }

      const position = (await context.db
        .collection('position-overviews')
        .findOne({
          positionId,
          userId: userSub,
        })) as PositionOverviewProjection | null;

      if (!position) return null;

      return {
        id: position._id?.toString() ?? position.positionId,
        positionId: position.positionId,
        portfolioId: position.portfolioId,
        symbol: position.symbol,
        summary: position.summary,
        stockQuote: position.stockQuote,
      };
    },

    async positionOverviews(
      _parent: unknown,
      { portfolioId }: PositionOverviewsArgs,
      context: GraphQLContext
    ) {
      // Filter by authenticated user's sub property
      const userSub = context.user?.sub;
      if (!userSub) {
        throw new AuthenticationError('User not authenticated');
      }

      const positions = (await context.db
        .collection('position-overviews')
        .find({
          portfolioId,
          userId: userSub,
        })
        .toArray()) as unknown as PositionOverviewProjection[];

      return positions.map((position: PositionOverviewProjection) => ({
        id: position._id?.toString() ?? position.positionId,
        positionId: position.positionId,
        portfolioId: position.portfolioId,
        symbol: position.symbol,
        summary: position.summary,
        stockQuote: position.stockQuote,
      }));
    },
  },
};
