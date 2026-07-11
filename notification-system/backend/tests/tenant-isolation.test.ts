import { beforeAll, beforeEach, afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/db.js';

const t1u1 = { 'X-Tenant-Id': 't1', 'X-User-Id': 'u1' };
const t2u2 = { 'X-Tenant-Id': 't2', 'X-User-Id': 'u2' };

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.notification.deleteMany();
  await prisma.notification.createMany({
    data: [
      { id: 'n1', tenantId: 't1', userId: null, type: 'member_invited', title: 'T1 wide', body: 'Visible to t1', read: false, createdAt: new Date('2026-07-01T09:00:00Z') },
      { id: 'n2', tenantId: 't1', userId: 'u1', type: 'new_reply', title: 'T1 user', body: 'Visible to u1', read: false, createdAt: new Date('2026-07-02T09:00:00Z') },
      { id: 'n4', tenantId: 't2', userId: null, type: 'member_invited', title: 'T2 wide', body: 'Never visible to t1', read: false, createdAt: new Date('2026-07-03T09:00:00Z') }
    ]
  });
});

afterAll(async () => prisma.$disconnect());

describe('tenant isolation', () => {
  it('does not list notifications from another tenant', async () => {
    const response = await request(app).get('/notifications').set(t1u1).expect(200);
    expect(response.body.items.map((item: { id: string }) => item.id)).toEqual(['n2', 'n1']);
    expect(response.body.items.some((item: { id: string }) => item.id === 'n4')).toBe(false);
  });

  it('does not include another tenant in unread count', async () => {
    const response = await request(app).get('/notifications/unread-count').set(t1u1).expect(200);
    expect(response.body.count).toBe(2);
  });

  it('cannot mark another tenant notification as read by guessing its id', async () => {
    await request(app).patch('/notifications/n4/read').set(t1u1).expect(404);
    const unchanged = await prisma.notification.findUnique({ where: { id: 'n4' } });
    expect(unchanged?.read).toBe(false);
  });

  it('mark-all-read affects only visible notifications', async () => {
    const response = await request(app).patch('/notifications/read-all').set(t1u1).expect(200);
    expect(response.body.updated).toBe(2);
    const t2Notification = await prisma.notification.findUnique({ where: { id: 'n4' } });
    expect(t2Notification?.read).toBe(false);
  });

  it('tenant two can still see its own notification', async () => {
    const response = await request(app).get('/notifications').set(t2u2).expect(200);
    expect(response.body.items.map((item: { id: string }) => item.id)).toEqual(['n4']);
  });
});
