import Room from '../models/room.model.js';

import logger from '../utils/logger.js';

import {
  sendMessage,
  sendError,
  broadcastToUsers,
} from '../utils/socketUtils.js';

/**

 * ส่งข้อมูลห้องเริ่มต้นไปยัง client

 */

export const sendInitialRoomData = async (ws, activeConnections) => {
  try {
    const joinedRooms = await Room.find({ members: ws.userId })

      .populate({ path: 'members', select: 'username online' })

      .populate({ path: 'admin', select: 'username online' });

    const allRooms = await Room.find()

      .populate({ path: 'members', select: 'username online' })

      .populate({ path: 'admin', select: 'username online' });

    const availableRooms = allRooms.filter(
      (room) => !room.members.some((member) => member._id.equals(ws.userId))
    );

    sendMessage(ws, 'initial_rooms_data', {
      joined: joinedRooms,

      available: availableRooms,
    });
  } catch (error) {
    logger.error('Error sending initial room data:', error);

    sendError(ws, 'Failed to fetch initial room data');
  }
};

/**

 * จัดการการเข้าร่วมห้อง (สำหรับ real-time updates)

 */

export const handleJoinRoom = async (
  ws,

  roomId,

  activeConnections,

  broadcastRoomListUpdated
) => {
  try {
    const room = await Room.findByIdAndUpdate(
      roomId,

      { $addToSet: { members: ws.userId } },

      { new: true }
    )

      .populate({ path: 'members', select: 'username online' })

      .populate({ path: 'admin', select: 'username online' });

    if (!room) {
      return sendError(ws, 'Room not found');
    }

    ws.currentRoom = roomId;

    sendMessage(ws, 'room_joined', {
      roomId,

      name: room.name,
    }); // แจ้งเตือนสมาชิกคนอื่น

    const otherMembers = room.members.filter(
      (member) => member._id.toString() !== ws.userId
    );

    broadcastToUsers(
      otherMembers.map((member) => member._id),

      'user_joined_room',

      {
        roomId,

        userId: ws.userId,

        username: ws.username,
      },

      activeConnections
    ); // อัปเดตรายชื่อห้องสำหรับทุกคน

    broadcastRoomListUpdated(activeConnections);
  } catch (error) {
    logger.error('Error joining room via WebSocket:', error);

    sendError(ws, 'Failed to join room');
  }
};

/**

 * แจ้งเตือน Clients เมื่อรายชื่อห้องมีการอัปเดต (เข้าร่วม/สร้าง/ออก)

 */

export const broadcastRoomListUpdated = async (activeConnections) => {
  try {
    for (const userId of activeConnections.keys()) {
      const client = activeConnections.get(userId);

      if (client && client.readyState === client.OPEN) {
        const joinedRooms = await Room.find({ members: userId })

          .populate({ path: 'members', select: 'username online' })

          .populate({ path: 'admin', select: 'username online' });

        const allRooms = await Room.find()

          .populate({ path: 'members', select: 'username online' })

          .populate({ path: 'admin', select: 'username online' });

        const availableRooms = allRooms.filter(
          (room) => !room.members.some((member) => member._id.equals(userId))
        );

        sendMessage(client, 'rooms_updated', {
          joined: joinedRooms,

          available: availableRooms,
        });
      }
    }
  } catch (error) {
    logger.error('Error broadcasting updated room list:', error);
  }
};

/**

 * จัดการการออกจากห้อง

 */

export const handleLeaveRoom = async (
  ws,

  roomId,

  activeConnections,

  broadcastRoomListUpdated
) => {
  try {
    const room = await Room.findByIdAndUpdate(
      roomId,

      { $pull: { members: ws.userId } },

      { new: true }
    )

      .populate({ path: 'members', select: 'username online' })

      .populate({ path: 'admin', select: 'username online' });

    if (!room) {
      return sendError(ws, 'Room not found');
    }

    ws.currentRoom = null;

    sendMessage(ws, 'room_left', { roomId }); // แจ้งเตือนสมาชิกคนอื่น

    const otherMembers = room.members.filter(
      (member) => member._id.toString() !== ws.userId
    );

    broadcastToUsers(
      otherMembers.map((member) => member._id),

      'user_left_room',

      {
        roomId,

        userId: ws.userId,

        username: ws.username,
      },

      activeConnections
    ); // อัปเดตรายชื่อห้องสำหรับทุกคน

    broadcastRoomListUpdated(activeConnections);
  } catch (error) {
    logger.error('Error leaving room via WebSocket:', error);

    sendError(ws, 'Failed to leave room');
  }
};
