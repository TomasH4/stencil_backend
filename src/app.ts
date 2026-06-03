// BE-79: app.ts — Express application setup

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import { authRouter } from './interface/routes/authRouter';
import { artistRouter } from './interface/routes/artistRouter';
import { reviewRouter } from './interface/routes/reviewRouter';
import { appointmentRouter } from './interface/routes/appointmentRouter';
import { errorHandler } from './interface/middlewares/errorHandler';

export const app = express();

// ─── Global Middlewares ────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/artists', artistRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/appointments', appointmentRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handler (must be last) ─────────────────────────────────────────────

app.use(errorHandler);
