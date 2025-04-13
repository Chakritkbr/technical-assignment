import User from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * จัดการเมื่อ Client ตัดการเชื่อมต่อ
 */
export const handleDisconnect = async (
  ws,
  activeConnections,
  broadcastOnlineStatus
) => {
  activeConnections.delete(ws.userId);
  logger.info(`User ${ws.username} disconnected`);

  try {
    await User.findByIdAndUpdate(ws.userId, { online: false });
    broadcastOnlineStatus(ws.userId, false, ws.username, activeConnections);
  } catch (err) {
    logger.error('Failed to update user status:', err);
  }
};
