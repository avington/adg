import {
  AuthenticatedRequest,
  PositionOverviewModel,
} from '@adg/global-models';
import { PositionCreateSchema, validateData } from '@adg/global-validations';
import { googleJwtAuthMiddleware } from '@adg/server-auth';
import { CreatePositionCommandHandler } from '@adg/server-domain-position-command-handlers';
import { CreatePositionCommand } from '@adg/server-domain-position-commands';
import { BullMqEventBus } from '@adg/server-shared-event-bus-bullmq';
import { MongoEventStore } from '@adg/server-shared-event-store';
import { getQuote, searchSymbol } from '@adg/server-shared-fmp';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

export function positionsRouter(
  eventStore: MongoEventStore,
  eventBus: BullMqEventBus
): Router {
  const positionsRouter: Router = Router();

  positionsRouter.post(
    '/',
    googleJwtAuthMiddleware,
    validateData(PositionCreateSchema),
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.sub ?? '';
      if (!userId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Unauthorized' });
      }

      try {
        const { portfolioId, symbol } = req.body;

        // External API validation (symbol exists)
        const [summary, stockQuote] = await Promise.all([
          searchSymbol(symbol),
          getQuote(symbol),
        ]);

        if (!summary) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: 'Symbol not found' });
        }

        if (!stockQuote) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: 'Quote not found' });
        }

        // Create position data
        const positionId = uuidv4();
        const positionData: PositionOverviewModel = {
          positionId,
          portfolioId,
          userId,
          symbol,
          summary,
          stockQuote,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Execute command (portfolio validation happens inside)
        const command = new CreatePositionCommand(
          uuidv4(),
          positionId,
          positionData
        );

        const handler = new CreatePositionCommandHandler(eventStore, eventBus);
        await handler.execute(command);

        return res.status(StatusCodes.CREATED).json({
          message: 'Position created successfully',
          positionId,
          portfolioId,
          symbol,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;

        // Determine appropriate status code based on error
        if (errorMessage.includes('does not exist')) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: errorMessage });
        } else if (errorMessage.includes('does not have access')) {
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ error: errorMessage });
        } else if (errorMessage.includes('not active')) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: errorMessage });
        } else {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to create position',
          });
        }
      }
    }
  );

  return positionsRouter;
}
