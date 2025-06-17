import { ObjectId } from 'mongodb';
import { UserProjection } from '@adg/server-domain-read-models';

export default {
  Query: {
    async user(_parent: any, { id }: { id: string }, context: any) {
      const user = await context.db
        .collection('users')
        .findOne({ _id: new ObjectId(id) });
      console.log('user', user);
      if (!user) return null;
      return {
        id: user._id?.toString() ?? user.id,
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt?.toISOString?.() ?? String(user.createdAt),
        updatedAt:
          user.updatedAt?.toISOString?.() ??
          (user.updatedAt ? String(user.updatedAt) : null),
      };
    },
    async users(_parent: any, _args: any, context: any) {
      const users = await context.db.collection('users').find().toArray();
      return users.map((user: UserProjection) => ({
        id: user._id?.toString() ?? user.id,
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt?.toISOString?.() ?? String(user.createdAt),
        updatedAt:
          user.updatedAt?.toISOString?.() ??
          (user.updatedAt ? String(user.updatedAt) : null),
      }));
    },
  },
};
