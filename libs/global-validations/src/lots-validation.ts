import { z } from 'zod';
import {
  priceToNumberRequired,
  priceNumberToIntegerRequired,
} from './validation-helpers.js';

export const LotValidationSchema = z.object({
  lotId: z.string().optional(),
  symbol: z.string().min(1, 'Symbol is required'),
  portfolioId: z.string().min(1, 'Portfolio ID is required'),
  userId: z.string().optional(),
  transactionType: z.enum(['BUY', 'SELL'], {
    errorMap: () => ({
      message: 'Transaction type must be either BUY or SELL',
    }),
  }),
  shares: priceNumberToIntegerRequired,
  price: priceToNumberRequired,
  openDate: z.date({ required_error: 'Open Date is required' }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  lastUpdatedBy: z.string().optional(),
  costBasis: z.number().optional(),
  marketValue: z.number().optional(),
  holdingPeriod: z.enum(['SHORT_TERM', 'LONG_TERM']).optional(),
  gainsLosses: z.number().optional(),
  gainsLossesPercentage: z.number().optional(),
});

export const LotsFormValidationSchema = LotValidationSchema.pick({
  symbol: true,
  portfolioId: true,
  transactionType: true,
  shares: true,
  price: true,
  openDate: true,
});

export type LotModel = z.infer<typeof LotValidationSchema>;
export type TransactionType = 'BUY' | 'SELL';
export type HoldingPeriodsType = 'SHORT_TERM' | 'LONG_TERM';
