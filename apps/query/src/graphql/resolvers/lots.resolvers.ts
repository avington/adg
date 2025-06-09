import { ObjectId } from 'mongodb';
import { LotProjection } from '@adg/server-domain-read-models';

export default {
  Query: {
    async lot(_parent: any, { id }: { id: string }, context: any) {
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
    async lots(_parent: any, _args: any, context: any) {
      const lots = await context.db.collection('lots').find().toArray();
      return lots.map((lot: LotProjection) => ({
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
      }));
    },
  },
};
