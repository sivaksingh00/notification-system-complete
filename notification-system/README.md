# Tenant-Aware Notification System

A complete full-stack implementation of the notification challenge using React, TypeScript, Express, Prisma, SQLite, Vitest, and Supertest.

## Included

- Tenant-aware notification model and API
- Trusted challenge headers (`X-Tenant-Id`, `X-User-Id`)
- Paginated list with unread-first and newest-first ordering
- Unread badge count
- Mark one and mark all visible notifications as read
- Two reusable demo triggers
- Seed data from the challenge
- React notification bell with 20-second polling
- Automated tenant-isolation tests
- Integration and future-improvement notes

## Prerequisites

- Node.js 20.19 or newer
- npm 10 or newer

## First-time setup

From the project root:

```bash
npm install
npm run install:all
npm run db:setup
```

## Run frontend and backend together

```bash
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4000`.

## Run automated tests

From the project root:

```bash
npm test
```

The test command automatically creates `backend/test.db`. Tests clear and recreate their own records and never modify the seeded development database.

## Build production bundles

```bash
npm run build
```

## Manual API examples

All protected API requests require both headers.

```bash
curl -H "X-Tenant-Id: t1" -H "X-User-Id: u1" http://localhost:4000/notifications
```

```bash
curl -X POST http://localhost:4000/demo/member-invited \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: t1" \
  -H "X-User-Id: u1" \
  -d '{"memberName":"Aarav","agencyName":"Nova Talent"}'
```

```bash
curl -X POST http://localhost:4000/demo/creator-replied \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: t1" \
  -H "X-User-Id: u1" \
  -d '{"creatorName":"Meera Kapoor","assignedUserId":"u1"}'
```

## Tenant isolation demonstration

Using `t1/u1`, the seeded data returns `n1`, `n2`, and `n3`, never `n4`. Trying to mark `n4` as read with tenant `t1` returns `404`, and `n4` remains unchanged.

Switch the frontend identity fields between `t1/u1` and `t2/u2` to show separate tenant views.

## Important production note

The header middleware is intentionally simplified for the challenge. In a real product, tenant and user identity must come from a validated JWT or server-side session.
