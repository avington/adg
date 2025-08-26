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

// Helper to normalize lots ensuring non-nullable GraphQL fields are satisfied
function normalizeLots(position: PositionOverviewProjection) {
  const l = position.lots;
  if (!l) return undefined;

  const num = (v: unknown) =>
    typeof v === 'number' && !Number.isNaN(v) ? v : 0;

  return {
    portfolioId: l.portfolioId ?? position.portfolioId,
    positionId: l.positionId ?? position.positionId,
    totalShares: num(l.totalShares),
    averagePrice: num(l.averagePrice),
    realizedGains: num(l.realizedGains),
    unrealizedGains: num(l.unrealizedGains),
    costBasis: num(l.costBasis),
  };
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
        // ensure all required fields in lots are non-null
        lots: normalizeLots(position),
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
        // ensure all required fields in lots are non-null
        lots: normalizeLots(position),
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
        // ensure all required fields in lots are non-null
        lots: normalizeLots(position),
      };
    },

    // NEW: distinct symbols for authenticated user
    async userSymbols(
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) {
      const userSub = context.user?.sub;
      if (!userSub) throw new AuthenticationError('User not authenticated');

      const symbols = await context.db
        .collection('position-overviews')
        .distinct('symbol', { userId: userSub });

      // Optional: sort alphabetically
      return symbols.sort((a, b) => a.localeCompare(b));
    },
  },
};
