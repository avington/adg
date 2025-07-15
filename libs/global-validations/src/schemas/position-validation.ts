import { z } from 'zod';

export const PositionCreateSchema = z.object({
  symbol: z
    .string()
    .min(1, { message: 'Position must be at least 1 character long' })
    .max(100, { message: 'Position must not exceed 100 characters' }),
  portfolioId: z.string().uuid({ message: 'portfolioId must be a valid UUID' }),
});

export type PositionCreateRequestModel = z.infer<typeof PositionCreateSchema>;
