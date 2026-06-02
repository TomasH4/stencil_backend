// BE-38: JWT utilities — sign and verify tokens

import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

function getSecret(): string {
  const secret = process.env['JWT_SECRET'];
  if (!secret) {
    throw new AppError('JWT_SECRET is not configured', 500, false);
  }
  return secret;
}

/**
 * Generates a signed JWT token with the given payload.
 * Expiration is read from JWT_EXPIRES_IN env variable (default: 7d).
 */
export function generateToken(payload: JwtPayload): string {
  const expiresIn = (process.env['JWT_EXPIRES_IN'] ?? '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign(payload, getSecret(), { expiresIn });
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws AppError(401) if token is invalid or expired.
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, getSecret()) as JwtPayload;
    return decoded;
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}
