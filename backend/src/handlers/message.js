import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Room from '../models/room.model.js';
import logger from '../utils/logger.js';
import {
  sendMessage,
  parseMessage,
  sendError,
  broadcastToUsers,
} from '../utils/socketUtils.js';

/**
 * จัดการข้อความที่ได้รับจาก Client
 */
export const handleMessage = async (ws, data, activeConnections) => {
  try {
    const { event, data: messageData } = parseMessage(data);

    switch (event) {
      case 'private_message':
        await handlePrivateMessage(ws, messageData, activeConnections);
        break;
      case 'room_message':
        await handleRoomMessage(ws, messageData, activeConnections);
        break;
      case 'join_room':
        // Note: Join room logic is now in handlers/room.js
        break;
      case 'leave_room':
        // Note: Leave room logic is now in handlers/room.js
        break;
      case 'request_users': // Handle request for users
        await handleRequestUsers(ws);
        break;
      default:
        logger.warn(`Unknown event type: ${event}`);
    }
  } catch (err) {
    logger.error('Message handling error:', err);
    sendError(ws, 'Invalid message format');
  }
};

/**
 * จัดการข้อความส่วนตัว
 */
const handlePrivateMessage = async (ws, data, activeConnections) => {
  const { recipientId, content } = data;

  // ตรวจสอบว่าผู้รับมีอยู่จริง
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return sendError(ws, 'Recipient not found');
  }

  // สร้างและบันทึกข้อความ
  const message = await Message.create({
    content,
    sender: ws.userId,
    recipient: recipientId,
  });

  try {
    const senderUser = await User.findById(ws.userId);
    if (!senderUser) {
      logger.error(`Sender user not found: ${ws.userId}`);
      return sendError(ws, 'Sender not found');
    }

    // ส่งข้อความกลับไปให้ผู้ส่ง
    sendMessage(ws, 'private_message', {
      messageId: message._id,
      content,
      recipientId,
      timestamp: message.createdAt,
      sender: {
        _id: senderUser._id,
        username: senderUser.username,
      },
    });

    // ส่งข้อความไปให้ผู้รับ (ถ้าออนไลน์)
    if (activeConnections.has(recipientId)) {
      sendMessage(activeConnections.get(recipientId), 'private_message', {
        messageId: message._id,
        content,
        sender: {
          _id: senderUser._id,
          username: senderUser.username,
        },
        timestamp: message.createdAt,
      });
    }
  } catch (error) {
    logger.error('Error fetching sender user:', error);
    return sendError(ws, 'Failed to fetch sender information');
  }
};

/**
 * จัดการข้อความกลุ่ม
 */
const handleRoomMessage = async (ws, data, activeConnections) => {
  const { roomId, content } = data;

  // ตรวจสอบว่าผู้ส่งอยู่ในห้องหรือไม่
  const room = await Room.findOne({
    _id: roomId,
    members: ws.userId,
  });
  if (!room) {
    return sendError(ws, 'Not a member of this room');
  }

  // สร้างและบันทึกข้อความ
  const message = await Message.create({
    content,
    sender: ws.userId,
    room: roomId,
  });
  try {
    const senderUser = await User.findById(ws.userId);
    if (!senderUser) {
      logger.error(`Sender user not found: ${ws.userId}`);
      return sendError(ws, 'Sender not found');
    }

    // อัพเดทห้องด้วยข้อความล่าสุด
    room.lastMessage = message._id;
    await room.save();

    // ส่งข้อความไปยังสมาชิกทุกคนที่ออนไลน์
    const members = room.members.filter(
      (member) => member.toString() !== ws.userId
    );
    broadcastToUsers(
      members,
      'room_message',
      {
        messageId: message._id,
        content,
        roomId,
        sender: {
          _id: senderUser._id,
          username: senderUser.username,
        },
        timestamp: message.createdAt,
      },
      activeConnections
    );

    // ยืนยันการส่งกลับไปให้ผู้ส่ง
    sendMessage(ws, 'room_message_sent', {
      messageId: message._id,
      roomId,
      timestamp: message.createdAt,
    });
  } catch (error) {
    logger.error('Error fetching sender user for room message:', error);
    return sendError(ws, 'Failed to fetch sender information for room message');
  }

  // ยืนยันการส่งกลับไปให้ผู้ส่ง
  sendMessage(ws, 'room_message_sent', {
    messageId: message._id,
    roomId,
    timestamp: message.createdAt,
  });
};
