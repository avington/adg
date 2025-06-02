import {
  CreateUserCommandHandler,
  UpdateUserNameCommandHandler,
} from '@adg/server-domain-user-command-handlers';
import {
  CreateUserCommand,
  UpdateUserNameCommand,
} from '@adg/server-domain-user-commands';
import { BullMqEventBus } from '@adg/server-shared-event-bus-bullmq';
import { MongoEventStore } from '@adg/server-shared-event-store';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

export function userRouter(
  eventStore: MongoEventStore,
  eventBus: BullMqEventBus
): Router {
  const userRouter: Router = Router();

  // --- User Routes ---
  userRouter.post('/', async (req: Request, res: Response) => {
    try {
      const { userId, firstName, lastName, email, fullName, createdAt } =
        req.body;
      const command = new CreateUserCommand(crypto.randomUUID(), userId, {
        userId,
        firstName,
        lastName,
        email,
        fullName,
        createdAt,
      });
      const handler = new CreateUserCommandHandler(eventStore, eventBus);
      await handler.execute(command);
      res.status(StatusCodes.CREATED).json({ message: 'User created' });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: (err as Error).message });
    }
  });

  userRouter.put('/', async (req: Request, res: Response) => {
    try {
      const { userId, firstName, lastName, updatedAt } = req.body;
      const command = new UpdateUserNameCommand(crypto.randomUUID(), userId, {
        userId,
        firstName,
        lastName,
        updatedAt,
      });
      const handler = new UpdateUserNameCommandHandler(eventStore, eventBus);
      await handler.execute(command);
      res.status(StatusCodes.ACCEPTED).json({ message: 'User name updated' });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: (err as Error).message });
    }
  });

  return userRouter;
}

export default userRouter;
