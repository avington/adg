import { z } from 'zod';

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
  shares: z.number().int().positive('Shares must be a positive integer'),
  price: z.number().optional(),
  openDate: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  lastUpdatedBy: z.string().optional(),
  costBasis: z.number().optional(),
  marketValue: z.number().optional(),
  holdingPeriod: z.string().optional(), // Assuming HoldingPeriodsType is a string enum
  gainsLosses: z.number().optional(),
  gainsLossesPercentage: z.number().optional(),
});

export type LotModel = z.infer<typeof LotValidationSchema>;
export type TransactionType = 'BUY' | 'SELL';
