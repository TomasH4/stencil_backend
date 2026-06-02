// BE-69: validateQuery middleware — Zod schema validation for query string params

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.map(String).join('.'),
        message: e.message,
      }));

      res.status(400).json({
        error: {
          message: 'Invalid query parameters',
          statusCode: 400,
          details: errors,
        },
      });
      return;
    }

    // Express v5: req.query is a read-only getter on the prototype.
    // Use Object.defineProperty to shadow it with a writable own property.
    Object.defineProperty(req, 'query', {
      value: result.data,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    next();
  };
}
