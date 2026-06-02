// BE-68: validateBody middleware — Zod schema validation for request body

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.map(String).join('.'),
        message: e.message,
      }));

      res.status(400).json({
        error: {
          message: 'Validation failed',
          statusCode: 400,
          details: errors,
        },
      });
      return;
    }

    // Attach parsed (and possibly transformed) data back to req.body
    req.body = result.data;
    next();
  };
}
