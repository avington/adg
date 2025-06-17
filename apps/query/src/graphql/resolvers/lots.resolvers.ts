import { ObjectId } from 'mongodb';
import { LotProjection } from '@adg/server-domain-read-models';
import { TransactionType } from '@adg/global-validations';

// Define the expected shape of the context if you have it
interface GraphQLContext {
  db: {
    collection: (name: string) => {
      findOne: (
        query: Partial<Record<keyof LotProjection, unknown>>
      ) => Promise<LotProjection | null>;
      find: (query: LotFilterType) => {
        toArray: () => Promise<LotProjection[]>;
      };
    };
  };
}

type LotFilterType = {
  portfolioId?: string;
  symbol?: string;
  userId?: string;
  transactionType?: TransactionType;
};

interface LotArgs {
  id: string;
}

interface LotsArgs {
  portfolioId?: string;
  symbol?: string;
}

export default {
  Query: {
    async lot(
      _parent: unknown, // No parent object for root Query
      { id }: LotArgs,
      context: GraphQLContext
    ) {
      const lot = (await context.db
        .collection('lots')
        .findOne({ _id: new ObjectId(id) })) as LotProjection | null;
      if (!lot) return null;
      return {
        id: lot._id?.toString() ?? lot.lotId,
        lotId: lot.lotId,
        symbol: lot.symbol,
        portfolioId: lot.portfolioId,
        userId: lot.userId,
        transactionType: lot.transactionType,
        shares: lot.shares,
        price: lot.price,
        openDate: lot.openDate?.toISOString?.() ?? String(lot.openDate),
        createdAt:
          lot.createdAt?.toISOString?.() ??
          (lot.createdAt ? String(lot.createdAt) : null),
        updatedAt:
          lot.updatedAt?.toISOString?.() ??
          (lot.updatedAt ? String(lot.updatedAt) : null),
        lastUpdatedBy: lot.lastUpdatedBy,
      };
    },
    async lots(
      _parent: unknown,
      args: LotsArgs & { transactionType?: TransactionType },
      context: GraphQLContext
    ) {
      const filter: LotFilterType = {};
      if (args.portfolioId) filter.portfolioId = args.portfolioId;
      if (args.symbol) filter.symbol = args.symbol;
      if (args.transactionType) filter.transactionType = args.transactionType;
      return (await context.db.collection('lots').find(filter).toArray())
        .map((lot: LotProjection) => {
          const id = lot._id?.toString() ?? lot.lotId;
          if (!id) return null;
          return {
            id,
            lotId: lot.lotId,
            symbol: lot.symbol,
            portfolioId: lot.portfolioId,
            userId: lot.userId,
            transactionType: lot.transactionType,
            shares: lot.shares,
            price: lot.price,
            openDate: lot.openDate?.toISOString?.() ?? String(lot.openDate),
            createdAt:
              lot.createdAt?.toISOString?.() ??
              (lot.createdAt ? String(lot.createdAt) : null),
            updatedAt:
              lot.updatedAt?.toISOString?.() ??
              (lot.updatedAt ? String(lot.updatedAt) : null),
            lastUpdatedBy: lot.lastUpdatedBy,
          };
        })
        .filter(Boolean);
    },
  },
};
