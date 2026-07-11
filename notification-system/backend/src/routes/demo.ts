import { Router } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../types.js';
import { createNotification } from '../services/notificationService.js';

export const demoRouter = Router();

const memberSchema = z.object({ memberName: z.string().min(1), agencyName: z.string().min(1) });
const replySchema = z.object({ creatorName: z.string().min(1), assignedUserId: z.string().min(1) });

demoRouter.post('/member-invited', async (req, res, next) => {
  try {
    const parsed = memberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'memberName and agencyName are required.' });
      return;
    }
    const { tenantId } = (req as AuthenticatedRequest).auth;
    const notification = await createNotification({
      tenantId,
      userId: null,
      type: 'member_invited',
      title: 'New team member',
      body: `${parsed.data.memberName} joined ${parsed.data.agencyName}`
    });
    res.status(201).json({ event: 'member_invited', notification });
  } catch (error) {
    next(error);
  }
});

demoRouter.post('/creator-replied', async (req, res, next) => {
  try {
    const parsed = replySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'creatorName and assignedUserId are required.' });
      return;
    }
    const { tenantId } = (req as AuthenticatedRequest).auth;
    const notification = await createNotification({
      tenantId,
      userId: parsed.data.assignedUserId,
      type: 'new_reply',
      title: 'Creator replied',
      body: `${parsed.data.creatorName} replied to your outreach message`
    });
    res.status(201).json({ event: 'creator_replied', notification });
  } catch (error) {
    next(error);
  }
});
