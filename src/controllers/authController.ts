import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, JwtPayload as LibJwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';

function signAccessToken(userId: string) {
  const payload: LibJwtPayload | string | Buffer = { sub: userId, type: 'access' } as unknown as LibJwtPayload;
  const options: SignOptions = { expiresIn: env.jwtAccessExpires as unknown as number };
  return jwt.sign(payload, env.jwtAccessSecret as unknown as jwt.Secret, options);
}

function signRefreshToken(userId: string) {
  const payload: LibJwtPayload | string | Buffer = { sub: userId, type: 'refresh' } as unknown as LibJwtPayload;
  const options: SignOptions = { expiresIn: env.jwtRefreshExpires as unknown as number };
  return jwt.sign(payload, env.jwtRefreshSecret as unknown as jwt.Secret, options);
}

export async function register(req: Request, res: Response) {
  const { name, email, password, timezone } = req.body as { name: string; email: string; password: string; timezone?: string };
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

  const existing = await User.findOne({ email }).lean();
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, timezone });

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, timezone: user.timezone }, accessToken, refreshToken });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  return res.json({ user: { id: user.id, name: user.name, email: user.email, timezone: user.timezone }, accessToken, refreshToken });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });

  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret as unknown as jwt.Secret) as { sub: string; type: string };
    if (payload.type !== 'refresh') return res.status(401).json({ message: 'Invalid token type' });
    const accessToken = signAccessToken(payload.sub);
    const newRefreshToken = signRefreshToken(payload.sub);
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (_err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
