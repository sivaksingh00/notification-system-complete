import type { Request } from 'express';

export type AuthIdentity = {
  tenantId: string;
  userId: string;
};

export interface AuthenticatedRequest extends Request {
  auth: AuthIdentity;
}
