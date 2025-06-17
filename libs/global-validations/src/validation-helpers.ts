import { z } from 'zod';

export const priceToNumberRequired = z
  .number()
  .refine((val) => val !== undefined && val !== null && !Number.isNaN(val), {
    message: 'Field is Required',
  })
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val), { message: 'Expected number' });

export const priceNumberToIntegerRequired = z
  .number()
  .refine((val) => val !== undefined && !Number.isNaN(val), {
    message: 'Field is Required',
  })
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val), { message: 'Expected number' })
  .refine((val) => Number.isInteger(val), { message: 'Expected integer' })
  .refine((val) => val >= 0, { message: 'Expected non-negative integer' });
