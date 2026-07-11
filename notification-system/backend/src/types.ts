import type { Request } from 'express';

export type AuthIdentity = {
  tenantId: string;
  userId: string;
};

export type AuthenticatedRequest = Request & {
  auth: AuthIdentity;
};
