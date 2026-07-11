import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '../db.js';

export type CreateNotificationInput = {
  id?: string;
  tenantId: string;
  userId?: string | null;
  type: string;
  title: string;
  body: string;
};

export async function createNotification(
  input: CreateNotificationInput
) {
  return prisma.notification.create({
    data: {
      id: input.id ?? randomUUID(),
      tenantId: input.tenantId,
      userId: input.userId ?? null,
      type: input.type,
      title: input.title,
      body: input.body,
      read: false,
      readAt: null
    }
  });
}

export function visibleToUserWhere(
  tenantId: string,
  userId: string
): Prisma.NotificationWhereInput {
  return {
    tenantId,
    OR: [
      { userId: null },
      { userId }
    ]
  };
}
