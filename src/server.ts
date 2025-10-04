import mongoose from 'mongoose';
import app from './app';
import { env } from './config/env';

async function start() {
  await mongoose.connect(env.mongoUri);
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
