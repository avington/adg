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
  .refine(
    (val) =>
      val !== undefined &&
      val !== null &&
      !Number.isNaN(val) &&
      isFinite(val) &&
      Number.isInteger(val) &&
      val >= 0,
    {
      message: 'Expected non-negative integer',
    }
  )
  .transform((val) => Number(val));
