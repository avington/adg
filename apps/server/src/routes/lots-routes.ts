import { AuthenticatedRequest } from '@adg/global-models';
import { LotValidationSchema, validateData } from '@adg/global-validations';
import { googleJwtAuthMiddleware } from '@adg/server-auth';
import {
  CreateLotCommandHandler,
  UpdateLotCommandHandler,
} from '@adg/server-domain-lot-command-handlers';
import {
  CreateLotCommand,
  UpdateLotCommand,
} from '@adg/server-domain-lot-commands';
import { BullMqEventBus } from '@adg/server-shared-event-bus-bullmq';
import { MongoEventStore } from '@adg/server-shared-event-store';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

export function lotsRouter(
  eventStore: MongoEventStore,
  eventBus: BullMqEventBus
): Router {
  const lotsRouter: Router = Router();

  // --- Lot Routes ---
  lotsRouter.post(
    '/',
    googleJwtAuthMiddleware,
    validateData(LotValidationSchema),
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.sub ?? '';
      const lotId = uuidv4(); // Generate a new UUID for the lot
      try {
        const {
          symbol,
          portfolioId,
          transactionType,
          shares,
          price,
          openDate,
        } = req.body;
        const upperSymbol = symbol.toUpperCase();
        const command = new CreateLotCommand(uuidv4(), lotId, {
          lotId,
          symbol: upperSymbol,
          portfolioId,
          userId,
          transactionType,
          shares,
          price,
          openDate: new Date(openDate),
          createdAt: new Date(),
          lastUpdatedBy: userId,
        });
        const handler = new CreateLotCommandHandler(eventStore, eventBus);
        await handler.execute(command);
        res.status(StatusCodes.CREATED).json({ message: 'Lot created' });
      } catch (err) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: (err as Error).message });
      }
    }
  );

  lotsRouter.put(
    '/',
    googleJwtAuthMiddleware,
    validateData(LotValidationSchema),
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.sub ?? '';
      try {
        const {
          lotId,
          symbol,
          portfolioId,
          transactionType,
          shares,
          price,
          openDate,
          updatedAt,
          lastUpdatedBy,
        } = req.body;
        const upperSymbol = symbol.toUpperCase();
        const command = new UpdateLotCommand(uuidv4(), lotId, {
          lotId,
          symbol: upperSymbol,
          portfolioId,
          userId,
          transactionType,
          shares,
          price,
          openDate: new Date(openDate),
          updatedAt: updatedAt ? new Date(updatedAt) : undefined,
          lastUpdatedBy,
        });
        const handler = new UpdateLotCommandHandler(eventStore, eventBus);
        await handler.execute(command);
        res.status(StatusCodes.OK).json({ message: 'Lot updated' });
      } catch (err) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: (err as Error).message });
      }
    }
  );

  return lotsRouter;
}
