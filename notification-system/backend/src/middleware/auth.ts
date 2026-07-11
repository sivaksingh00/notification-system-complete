import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types.js';

export function trustedHeaderAuth(req: Request, res: Response, next: NextFunction): void {
  const tenantId = req.header('X-Tenant-Id');
  const userId = req.header('X-User-Id');

  if (!tenantId || !userId) {
    res.status(400).json({ error: 'X-Tenant-Id and X-User-Id headers are required.' });
    return;
  }

  // Challenge-only auth convention. In production, these values would be derived
  // from a validated JWT/session rather than trusted directly from request headers.
  (req as AuthenticatedRequest).auth = { tenantId, userId };
  next();
}
