import User from '../models/user.model.js';
import { sendMessage, sendError } from '../utils/socketUtils.js';
import logger from '../utils/logger.js';

/**
 * จัดการการร้องขอรายชื่อผู้ใช้
 */
export const handleRequestUsers = async (ws) => {
  try {
    const allUsers = await User.find({}).select('_id username online');
    sendMessage(ws, 'users_data', allUsers);
  } catch (error) {
    logger.error('Error fetching users:', error);
    sendError(ws, 'Failed to fetch users');
  }
};
