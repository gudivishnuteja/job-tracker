import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/error';

// Routers (to be implemented)
import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import applicationsRouter from './routes/applications';
import remindersRouter from './routes/reminders';
import documentsRouter from './routes/documents';
import contactsRouter from './routes/contacts';
import analyticsRouter from './routes/analytics';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/analytics', analyticsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
