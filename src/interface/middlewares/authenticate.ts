// BE-66: authenticate middleware — extract and verify JWT from Authorization header
// Attaches decoded payload to req.user for downstream use

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../../shared/utils/jwt';
import { AppError } from '../../shared/errors/AppError';

// Extend Express's Request type to include `user`
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication token is required', 401));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication token is required', 401));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
