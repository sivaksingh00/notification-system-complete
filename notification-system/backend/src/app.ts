import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { trustedHeaderAuth } from './middleware/auth.js';
import { demoRouter } from './routes/demo.js';
import { notificationsRouter } from './routes/notifications.js';

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(trustedHeaderAuth);
app.use('/notifications', notificationsRouter);
app.use('/demo', demoRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error.' });
});
