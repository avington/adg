import { ObjectId } from 'mongodb';
import { PortfolioProjection } from '@adg/server-domain-read-models';

export default {
  Query: {
    async portfolio(_parent: any, { id }: { id: string }, context: any) {
      const portfolio = (await context.db
        .collection('portfolios')
        .findOne({ _id: new ObjectId(id) })) as PortfolioProjection | null;
      if (!portfolio) return null;
      return {
        id: portfolio._id?.toString() ?? portfolio.id,
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
    async portfolios(_parent: any, _args: any, context: any) {
      const portfolios = await context.db
        .collection('portfolios')
        .find()
        .toArray();
      return portfolios.map((portfolio: PortfolioProjection) => ({
        id: portfolio._id?.toString() ?? portfolio.id,
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
