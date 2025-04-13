import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.route.js';
import roomRoutes from './routes/room.route.js';
import messageRoutes from './routes/message.route.js';
import { httpLogger } from './utils/logger.js';

await connectDB();

dotenv.config({ path: './.env' });

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);

app.use('/api/auth', authRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/message', messageRoutes);

console.log(`CLIENT_URL env: ${process.env.CORS_ORIGIN}`);
export default app;
