import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  sub: string; // userId
  type: 'access' | 'refresh';
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret as unknown as jwt.Secret) as JwtPayload;
    if (payload.type !== 'access') {
      return res.status(401).json({ message: 'Invalid token type' });
    }
    (req as any).userId = payload.sub;
    return next();
  } catch (
    _err
  ) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
