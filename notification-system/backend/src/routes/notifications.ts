import { Router, type Request } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import type {
  AuthenticatedRequest,
  AuthIdentity
} from '../types.js';
import {
  createNotification,
  visibleToUserWhere
} from '../services/notificationService.js';

export const notificationsRouter = Router();

const createSchema = z.object({
  userId: z.string().nullable().optional(),
  type: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1)
});

/**
 * Auth middleware adds the auth property before these routes run.
 * The unknown cast prevents Express generic Request type conflicts.
 */
function getAuth(req: Request): AuthIdentity {
  return (req as unknown as AuthenticatedRequest).auth;
}

/**
 * POST /notifications
 * Create a notification inside the caller's tenant.
 */
notificationsRouter.post('/', async (req, res, next) => {
  try {
    const { tenantId } = getAuth(req);

    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid request body',
        details: parsed.error.flatten()
      });
      return;
    }

    const notification = await createNotification({
      tenantId,
      ...parsed.data
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /notifications
 * Return visible notifications, unread first and newest first.
 */
notificationsRouter.get('/', async (req, res, next) => {
  try {
    const { tenantId, userId } = getAuth(req);

    const page =
      Math.max(
        1,
        Number.parseInt(String(req.query.page ?? '1'), 10) || 1
      );

    const pageSize = Math.min(
      50,
      Math.max(
        1,
        Number.parseInt(String(req.query.pageSize ?? '10'), 10) || 10
      )
    );

    const where = visibleToUserWhere(tenantId, userId);

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: [
          { read: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * pageSize,
        take: pageSize
      }),

      prisma.notification.count({
        where
      })
    ]);

    res.json({
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /notifications/unread-count
 * Return unread count for notifications visible to the caller.
 */
notificationsRouter.get(
  '/unread-count',
  async (req, res, next) => {
    try {
      const { tenantId, userId } = getAuth(req);

      const count = await prisma.notification.count({
        where: {
          ...visibleToUserWhere(tenantId, userId),
          read: false
        }
      });

      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /notifications/read-all
 * Mark all notifications visible to the caller as read.
 */
notificationsRouter.patch(
  '/read-all',
  async (req, res, next) => {
    try {
      const { tenantId, userId } = getAuth(req);

      const result = await prisma.notification.updateMany({
        where: {
          ...visibleToUserWhere(tenantId, userId),
          read: false
        },
        data: {
          read: true,
          readAt: new Date()
        }
      });

      res.json({
        updated: result.count
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /notifications/:id/read
 * Mark one visible notification as read.
 */
notificationsRouter.patch(
  '/:id/read',
  async (req, res, next) => {
    try {
      const { tenantId, userId } = getAuth(req);

      const notification = await prisma.notification.findFirst({
        where: {
          id: req.params.id,
          ...visibleToUserWhere(tenantId, userId)
        }
      });

      // Return 404 so another tenant cannot discover whether the ID exists.
      if (!notification) {
        res.status(404).json({
          error: 'Notification not found.'
        });
        return;
      }

      const updated = await prisma.notification.update({
        where: {
          id: notification.id
        },
        data: notification.read
          ? {}
          : {
              read: true,
              readAt: new Date()
            }
      });

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);
