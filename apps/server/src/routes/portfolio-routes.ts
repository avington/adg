import { BullMqEventBus } from '@adg/server-shared-event-bus-bullmq';
import { MongoEventStore } from '@adg/server-shared-event-store';
import { Router, Request, Response } from 'express';
import {
  CreatePortfolioCommandHandler,
  UpdatePortfolioCommandHandler,
} from '@adg/server-domain-portfolio-command-handlers';
import {
  CreatePortfolioCommand,
  UpdatePortfolioCommand,
} from '@adg/server-domain-portfolio-commands';
import { StatusCodes } from 'http-status-codes';
import { googleJwtAuthMiddleware } from '@adg/server-auth';
import { AuthenticatedRequest, UserModel } from '@adg/global-models';



export function portfolioRouter(
  eventStore: MongoEventStore,
  eventBus: BullMqEventBus
) {
  const portfolioRouter: Router = Router();

  // --- Portfolio Routes ---
  portfolioRouter.post(
    '/',
    googleJwtAuthMiddleware,
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.sub ?? '';
      try {
        const {
          portfolioId,
          name,
          description,
          isActive,
          createdAt,
          lastUpdatedBy,
        } = req.body;
        const command = new CreatePortfolioCommand(
          crypto.randomUUID(),
          portfolioId,
          {
            portfolioId,
            userId,
            name,
            description,
            isActive,
            createdAt,
            lastUpdatedBy,
          }
        );
        const handler = new CreatePortfolioCommandHandler(eventStore, eventBus);
        await handler.execute(command);
        res.status(StatusCodes.CREATED).json({ message: 'Portfolio created' });
      } catch (err) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: (err as Error).message });
      }
    }
  );

  portfolioRouter.put('/', async (req: Request, res: Response) => {
    try {
      const {
        portfolioId,
        userId,
        name,
        description,
        isActive,
        updatedAt,
        lastUpdatedBy,
      } = req.body;
      const command = new UpdatePortfolioCommand(
        crypto.randomUUID(),
        portfolioId,
        {
          portfolioId,
          userId,
          name,
          description,
          isActive,
          updatedAt,
          lastUpdatedBy,
        }
      );
      const handler = new UpdatePortfolioCommandHandler(eventStore, eventBus);
      await handler.execute(command);
      res.status(StatusCodes.ACCEPTED).json({ message: 'Portfolio updated' });
    } catch (err) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: (err as Error).message });
    }
  });

  return portfolioRouter;
}
