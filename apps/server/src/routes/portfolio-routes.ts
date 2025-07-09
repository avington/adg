import { AuthenticatedRequest } from '@adg/global-models';
import { PortfolioCreateSchema, validateData } from '@adg/global-validations';
import { googleJwtAuthMiddleware } from '@adg/server-auth';
import {
  CreatePortfolioCommandHandler,
  UpdatePortfolioCommandHandler,
} from '@adg/server-domain-portfolio-command-handlers';
import {
  CreatePortfolioCommand,
  UpdatePortfolioCommand,
} from '@adg/server-domain-portfolio-commands';
import { BullMqEventBus } from '@adg/server-shared-event-bus-bullmq';
import { MongoEventStore } from '@adg/server-shared-event-store';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

export function portfolioRouter(
  eventStore: MongoEventStore,
  eventBus: BullMqEventBus
) {
  const portfolioRouter: Router = Router();

  // --- Portfolio Routes ---
  portfolioRouter.post(
    '/',
    googleJwtAuthMiddleware,
    validateData(PortfolioCreateSchema),
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.sub ?? '';
      const portfolioId = uuidv4(); // Generate a new UUID for the portfolio

      if (!userId) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'User not authenticated' });
        return;
      }

      try {
        const { name, description } = req.body;
        const command = new CreatePortfolioCommand(uuidv4(), portfolioId, {
          portfolioId,
          userId, // Now guaranteed to be a string
          name,
          description,
          isActive: true,
          createdAt: new Date(),
          lastUpdatedBy: userId,
        });
        const handler = new CreatePortfolioCommandHandler(eventStore, eventBus);
        await handler.execute(command);
        res
          .status(StatusCodes.CREATED)
          .json({ message: 'Portfolio created', portfolioId, name });
      } catch (err) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: (err as Error).message });
      }
    }
  );

  portfolioRouter.put(
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
    }
  );

  return portfolioRouter;
}
