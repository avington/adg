import {
  AuthenticatedRequest,
  CompanyProfileModel,
  PositionOverviewModel,
  StockQuoteModel,
} from '@adg/global-models';
import { PositionCreateSchema, validateData } from '@adg/global-validations';
import { googleJwtAuthMiddleware } from '@adg/server-auth';
import { CreatePositionCommandHandler } from '@adg/server-domain-position-command-handlers';
import { CreatePositionCommand } from '@adg/server-domain-position-commands';
import { BullMqEventBus } from '@adg/server-shared-event-bus-bullmq';
import { MongoEventStore } from '@adg/server-shared-event-store';
import { getProfile, getQuote } from '@adg/server-shared-fmp';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

export function positionsRouter(
  eventStore: MongoEventStore,
  eventBus: BullMqEventBus
): Router {
  const positionsRouter: Router = Router();
  const DEBUG_POSITIONS = process.env.DEBUG_POSITIONS === 'true';

  positionsRouter.post(
    '/',
    googleJwtAuthMiddleware,
    validateData(PositionCreateSchema),
    async (req: AuthenticatedRequest, res: Response) => {
      const started = Date.now();
      let aborted = false;
      const onAborted = () => {
        aborted = true;
        console.error('[positions] request aborted by client');
      };
      // node/express emits 'aborted' on req when client resets/ends early
      req.once('aborted', onAborted);

      if (DEBUG_POSITIONS) {
        console.log('[positions] -> POST / (enter)');
        console.log(
          '[positions] headers.authorization len =',
          (req.headers.authorization || '').length
        );
        try {
          const { portfolioId, symbol } = req.body || {};
          console.log('[positions] body snapshot =', { portfolioId, symbol });
        } catch {
          console.log('[positions] failed body snapshot');
        }
      }
      const userId = req.user?.sub ?? '';

      if (!userId) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Unauthorized' });
      }

      try {
        const { portfolioId, symbol } = req.body;
        // In dev, allow stubbing external API to avoid intermittent resets
        const DEV_ALLOW_ALL =
          process.env.DEV_ALLOW_ALL === 'true' ||
          process.env.BYPASS_DOMAIN_GUARDS === 'true';
        let summary: CompanyProfileModel | null = null;
        let stockQuote: StockQuoteModel | null = null;
        if (DEV_ALLOW_ALL) {
          console.warn('DEV_ALLOW_ALL active: stubbing FMP profile/quote');
          summary = {
            symbol,
            price: 100,
            marketCap: 1000000000,
            beta: 1,
            lastDividend: 0,
            range: '52w',
            change: 0,
            changePercentage: 0,
            volume: 0,
            averageVolume: 0,
            companyName: `${symbol} Inc`,
            currency: 'USD',
            cik: '0000000000',
            isin: 'US0000000000',
            cusip: '000000000',
            exchangeFullName: 'NASDAQ',
            exchange: 'NASDAQ',
            industry: 'Tech',
            website: 'https://example.com',
            description: 'Stub company profile',
            ceo: 'N/A',
            sector: 'Technology',
            country: 'USA',
            fullTimeEmployees: '0',
            phone: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            image: '',
            ipoDate: '2000-01-01',
            defaultImage: false,
            isEtf: false,
            isActivelyTrading: true,
            isAdr: false,
            isFund: false,
          };
          stockQuote = {
            symbol,
            name: `${symbol} Inc`,
            price: 100,
            changePercentage: 0,
            change: 0,
            volume: 0,
            dayLow: 99,
            dayHigh: 101,
            yearHigh: 150,
            yearLow: 80,
            marketCap: 1000000000,
            priceAvg50: 100,
            priceAvg200: 100,
            exchange: 'NASDAQ',
            open: 100,
            previousClose: 100,
            timestamp: Date.now(),
          };
        } else {
          // External API validation (symbol exists)
          try {
            const [profileResult, quoteResult] = await Promise.all([
              getProfile(symbol),
              getQuote(symbol),
            ]);
            summary = profileResult;
            stockQuote = quoteResult;
          } catch (apiError) {
            console.error('Error fetching symbol or quote:', {
              error: apiError,
            });
            return res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ error: 'Failed to fetch symbol or quote' });
          }
        }

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

        const json = {
          message: 'Position created successfully',
          positionId,
          portfolioId,
          symbol,
        };
        if (!aborted) {
          res.status(StatusCodes.CREATED).json(json);
        } else if (DEBUG_POSITIONS) {
          console.warn(
            '[positions] not sending response because request was aborted'
          );
        }
        if (DEBUG_POSITIONS) {
          console.log(
            '[positions] <- POST / (success) in',
            Date.now() - started,
            'ms'
          );
        }
        req.off('aborted', onAborted);
        return;
      } catch (error) {
        const errorMessage = (error as Error).message;
        // Server-side diagnostics
        console.error('[positions] error during POST /:', errorMessage, error);

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
          if (!aborted) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              error: 'Failed to create position',
              // Do not expose internal error details to clients
            });
          }
        }
        if (DEBUG_POSITIONS) {
          console.log(
            '[positions] <- POST / (error) in',
            Date.now() - started,
            'ms',
            'aborted=',
            aborted
          );
        }
        req.off('aborted', onAborted);
        return;
      }
    }
  );

  return positionsRouter;
}
