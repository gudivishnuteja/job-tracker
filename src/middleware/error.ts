import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const isKnown = typeof err === 'object' && err !== null && 'status' in (err as any);
  const status = isKnown ? (err as any).status : 500;
  const message = isKnown ? (err as any).message : 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ message });
}
