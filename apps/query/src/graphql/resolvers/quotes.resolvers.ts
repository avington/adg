import type { Db } from 'mongodb';
import { AuthenticationError } from 'apollo-server-errors';
import { getShortQuotes } from '@adg/server-shared-fmp';

interface GraphQLContext {
  db: Db;
  user?: { sub?: string };
}

export default {
  Query: {
    async quotesShort(
      _parent: unknown,
      { symbols }: { symbols: string[] },
      context: GraphQLContext
    ) {
      if (!context.user?.sub) throw new AuthenticationError('Unauthorized');
      const deduped = Array.from(
        new Set(
          (symbols ?? []).map((s) => s.toUpperCase().trim()).filter(Boolean)
        )
      );
      if (!deduped.length) return [];
      return getShortQuotes(deduped);
    },
  },
};
