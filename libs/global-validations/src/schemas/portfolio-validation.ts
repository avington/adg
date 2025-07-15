import { z } from 'zod';

export const PortfolioCreateSchema = z.object({
  portfolioId: z
    .string()
    .optional()
    .refine((val) => !val || z.string().uuid().safeParse(val).success, {
      message: 'Must be a valid UUID or empty',
    }),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  userId: z.string().uuid().optional(),
  lastUpdatedBy: z
    .string()
    .optional()
    .refine((val) => !val || z.string().uuid().safeParse(val).success, {
      message: 'Must be a valid UUID or empty',
    }),
  updatedAt: z.date().optional(),
});

export type PortfolioCreateModel = z.infer<typeof PortfolioCreateSchema>;

// For internal use where userId and portfolioId are required
export const PortfolioCreateInternalSchema = z.object({
  portfolioId: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  lastUpdatedBy: z.string().uuid(),
});

export type PortfolioCreateInternalModel = z.infer<
  typeof PortfolioCreateInternalSchema
>;
