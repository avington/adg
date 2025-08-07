import { ObjectId } from 'mongodb';
import { PortfolioProjection } from '@adg/global-read-models';
import { UserModel } from '@adg/global-models';
import type { Db } from 'mongodb';
import { AuthenticationError } from 'apollo-server-errors';

// Define the GraphQL context type
interface GraphQLContext {
  db: Db;
  user?: UserModel;
}

// Define resolver argument types
interface PortfolioArgs {
  id: string;
}

// For portfolios query with no arguments currently, but extensible for future filters
type PortfoliosArgs = Record<string, never>;

export default {
  Query: {
    async portfolio(
      _parent: unknown,
      { id }: PortfolioArgs,
      context: GraphQLContext
    ) {
      // Filter by authenticated user's sub property
      const userSub = context.user?.sub;
      if (!userSub) {
        throw new AuthenticationError('User not authenticated');
      }

      const portfolio = (await context.db.collection('portfolios').findOne({
        _id: new ObjectId(id),
        userId: userSub,
      })) as PortfolioProjection | null;
      if (!portfolio) return null;
      return {
        id: portfolio._id?.toString() ?? portfolio.id,
        portfolioId: portfolio.portfolioId?.toString() ?? null,
        name: portfolio.name,
        description: portfolio.description,
        userId: portfolio.userId,
        isActive: portfolio.isActive,
        createdAt:
          portfolio.createdAt?.toISOString?.() ?? String(portfolio.createdAt),
        updatedAt:
          portfolio.updatedAt?.toISOString?.() ??
          (portfolio.updatedAt ? String(portfolio.updatedAt) : null),
        // Add other fields as needed
      };
    },
    async portfolios(
      _parent: unknown,
      _args: PortfoliosArgs,
      context: GraphQLContext
    ) {
      // Filter by authenticated user's sub property
      const userSub = context.user?.sub;
      if (!userSub) {
        throw new AuthenticationError('User not authenticated');
      }

      const portfolios = (await context.db
        .collection('portfolios')
        .find({ userId: userSub })
        .toArray()) as unknown as PortfolioProjection[];
      return portfolios.map((portfolio: PortfolioProjection) => ({
        id: portfolio._id?.toString() ?? portfolio.id,
        portfolioId: portfolio.portfolioId?.toString() ?? null,
        name: portfolio.name,
        description: portfolio.description,
        userId: portfolio.userId,
        isActive: portfolio.isActive,
        createdAt:
          portfolio.createdAt?.toISOString?.() ?? String(portfolio.createdAt),
        updatedAt:
          portfolio.updatedAt?.toISOString?.() ??
          (portfolio.updatedAt ? String(portfolio.updatedAt) : null),
        // Add other fields as needed
      }));
    },
  },
};
