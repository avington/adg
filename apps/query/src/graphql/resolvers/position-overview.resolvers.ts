import { UserModel } from '@adg/global-models';
import { PositionOverviewProjection } from '@adg/global-read-models';
import { AuthenticationError } from 'apollo-server-errors';
import type { Db } from 'mongodb';

// Define the GraphQL context type
interface GraphQLContext {
  db: Db;
  user?: UserModel;
}

interface PositionOverviewArgs {
  positionId: string;
}

interface PositionOverviewsArgs {
  portfolioId: string;
}

// UPDATED: remove userId from args
interface PositionOverviewByUserPositionSymbolArgs {
  positionId: string;
  symbol: string;
}

export default {
  Query: {
    async positionOverview(
      _parent: unknown,
      { positionId }: PositionOverviewArgs,
      context: GraphQLContext
    ) {
      const userSub = context.user?.sub;
      if (!userSub) throw new AuthenticationError('User not authenticated');

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
        lots: position.lots,
      };
    },

    async positionOverviews(
      _parent: unknown,
      { portfolioId }: PositionOverviewsArgs,
      context: GraphQLContext
    ) {
      const userSub = context.user?.sub;
      if (!userSub) throw new AuthenticationError('User not authenticated');

      const positions = (await context.db
        .collection('position-overviews')
        .find({ portfolioId, userId: userSub })
        .toArray()) as unknown as PositionOverviewProjection[];

      return positions.map((position) => ({
        id: position._id?.toString() ?? position.positionId,
        positionId: position.positionId,
        portfolioId: position.portfolioId,
        symbol: position.symbol,
        summary: { ...position.summary },
        stockQuote: { ...position.stockQuote },
        lots: position.lots ? { ...position.lots } : undefined,
      }));
    },

    // UPDATED: derive userId from auth context only
    async positionOverviewByUserPositionSymbol(
      _parent: unknown,
      { positionId, symbol }: PositionOverviewByUserPositionSymbolArgs,
      context: GraphQLContext
    ) {
      const authSub = context.user?.sub;
      if (!authSub) throw new AuthenticationError('User not authenticated');

      const position = (await context.db
        .collection('position-overviews')
        .findOne({
          userId: authSub,
          positionId,
          symbol,
        })) as PositionOverviewProjection | null;

      if (!position) return null;

      return {
        id: position._id?.toString() ?? position.positionId,
        positionId: position.positionId,
        portfolioId: position.portfolioId,
        symbol: position.symbol,
        summary: { ...position.summary },
        stockQuote: { ...position.stockQuote },
        lots: position.lots ? { ...position.lots } : undefined,
      };
    },
  },
};
