import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedNotifications = [
  { id: 'n1', tenantId: 't1', userId: null, type: 'member_invited', title: 'New team member', body: 'Sarah joined Nova Talent', read: false, createdAt: new Date('2026-07-01T09:00:00Z'), readAt: null },
  { id: 'n2', tenantId: 't1', userId: 'u1', type: 'new_reply', title: 'Creator replied', body: 'Priya Sharma replied to your outreach message', read: false, createdAt: new Date('2026-07-02T14:30:00Z'), readAt: null },
  { id: 'n3', tenantId: 't1', userId: 'u1', type: 'report_ready', title: 'Report ready', body: 'Your July campaign report is ready to view', read: true, createdAt: new Date('2026-06-28T08:00:00Z'), readAt: new Date('2026-06-28T10:00:00Z') },
  { id: 'n4', tenantId: 't2', userId: null, type: 'member_invited', title: 'New team member', body: 'James joined Bright Star Agency', read: false, createdAt: new Date('2026-07-01T09:05:00Z'), readAt: null }
];

async function main() {
  for (const notification of seedNotifications) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: notification,
      create: notification
    });
  }
  console.log('Database seeded with notification examples.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
