import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

// Helper to convert ISO date strings to Date objects for known fields
function parseDatesRecursively(obj: any) {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (typeof value === 'string') {
        // Check for ISO date string
        const date = new Date(value);
        if (
          !isNaN(date.getTime()) &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)
        ) {
          obj[key] = date;
        }
      } else if (typeof value === 'object' && value !== null) {
        parseDatesRecursively(value);
      }
    }
  }
}

export function validateData(schema: z.AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    parseDatesRecursively(req.body);
    try {
      schema.parse(req.body);
      next();
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Validation error',
          errors: error.issues,
        });
      }
      next(error);
      return;
    }
  };
}
