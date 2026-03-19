import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { env } from '../../config/env';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  const isDevelopment = env.NODE_ENV === 'development';

  res.status(500).json({
    error: {
      message: isDevelopment ? err.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
}
