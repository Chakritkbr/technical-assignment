import { WebSocketServer } from 'ws';
import { verifyToken } from '../middlewares/socket.middleware.js';
import { handleMessage } from '../handlers/message.js';
import { handleDisconnect } from '../handlers/disconnect.js';
import User from '../models/user.model.js';
import { sendInitialRoomData } from '../handlers/room.js';
import { sendOnlineUsers, broadcastOnlineStatus } from '../handlers/status.js';
import logger from '../utils/logger.js';

const activeConnections = new Map();
const HEARTBEAT_INTERVAL = 30000;
const PONG_TIMEOUT = 5000;

export const setupSocket = (server) => {
  server.keepAliveTimeout = 60000;
  server.headersTimeout = 65000;

  const wss = new WebSocketServer({
    server,
    path: '/ws',
    perMessageDeflate: {
      zlibDeflateOptions: { chunkSize: 1024, memLevel: 7, level: 3 },
      zlibInflateOptions: { chunkSize: 10 * 1024 },
      threshold: 1024,
      concurrencyLimit: 10,
    },
    verifyClient: (info, done) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
        'http://localhost:5173',
        'http://localhost:3000',
      ];
      if (!info.origin || allowedOrigins.includes(info.origin)) {
        return done(true);
      }
      logger.warn(`Rejected connection from origin: ${info.origin}`);
      return done(false, 401, 'Unauthorized origin');
    },
  });

  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      if (!client.isAlive) {
        logger.warn(`Terminating inactive connection: ${client.userId}`);
        client.terminate();
        return;
      }
      client.isAlive = false;
      client.ping(null, false, (err) => {
        if (err) logger.error('Ping error:', err);
      });
      setTimeout(() => {
        if (!client.isAlive) {
          logger.warn(`No pong received, terminating: ${client.userId}`);
          client.terminate();
        }
      }, PONG_TIMEOUT);
    });
  }, HEARTBEAT_INTERVAL);

  wss.on('connection', async (ws, req) => {
    try {
      const token = getTokenFromRequest(req);
      const decoded = await verifyToken(token);
      if (!decoded) return ws.close(1008, 'Authentication failed');

      ws.isAlive = true;
      ws.userId = decoded.userId;
      ws.username = decoded.username;

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      activeConnections.set(ws.userId, ws);
      logger.info(`User ${ws.username} connected`);

      await User.findByIdAndUpdate(ws.userId, { online: true });
      broadcastOnlineStatus(ws.userId, true, ws.username, activeConnections);
      sendOnlineUsers(ws, activeConnections);
      await sendInitialRoomData(ws, activeConnections);

      ws.on('message', (data) => handleMessage(ws, data, activeConnections));
      ws.on('close', () =>
        handleDisconnect(ws, activeConnections, broadcastOnlineStatus)
      );
      ws.on('error', (err) => {
        logger.error('WebSocket error:', err);
        ws.close();
      });
    } catch (error) {
      console.error('Connection error:', error);
      logger.error('Connection error:', error);
      ws.close(1008, error.message || 'Invalid token');
    }
  });

  wss.on('close', () => {
    clearInterval(interval);
    logger.info('WebSocket server closed');
  });

  logger.info(`WebSocket Server running on path /ws`);
};

const getTokenFromRequest = (req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const queryToken = url.searchParams.get('token');
  console.log('Query token:', queryToken);
  return queryToken;
};

export const getActiveConnections = () => {
  return activeConnections;
};
