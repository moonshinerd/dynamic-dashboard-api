import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../../shared/errors/AppError';

type RequestField = 'body' | 'query' | 'params';

export function validateRequest(schema: ZodSchema, field: RequestField) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[field]);
      req[field] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => e.message).join('; ');
        throw new AppError(messages, 400, 'VALIDATION_ERROR');
      }
      throw err;
    }
  };
}
