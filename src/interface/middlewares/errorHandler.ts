// BE-70: errorHandler middleware — global error handling
// Must be registered LAST in Express middleware chain (4 params signature)

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';

interface PrismaError {
  code: string;
  meta?: { target?: string[] };
}

function isPrismaError(error: unknown): error is PrismaError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as PrismaError).code === 'string'
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Handle known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    });
    return;
  }

  // Handle Prisma-specific errors
  if (isPrismaError(err)) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: {
          message: 'A record with this value already exists',
          statusCode: 409,
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        error: {
          message: 'Record not found',
          statusCode: 404,
        },
      });
      return;
    }
  }

  // Fallback for unexpected errors — never expose stack trace
  if (process.env['NODE_ENV'] !== 'production') {
    process.stderr.write(`[DEBUG ERROR] ${String(err)}\n`);
    if (err instanceof Error) process.stderr.write(`[DEBUG STACK] ${err.stack ?? ''}\n`);
  }
  res.status(500).json({
    error: {
      message: 'An unexpected error occurred. Please try again later.',
      statusCode: 500,
    },
  });
}
