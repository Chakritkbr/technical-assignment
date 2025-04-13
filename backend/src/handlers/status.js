import { sendMessage } from '../utils/socketUtils.js';

/**
 * ส่งรายชื่อผู้ใช้ออนไลน์ไปยัง client ที่เพิ่งเชื่อมต่อ
 */
export const sendOnlineUsers = (ws, activeConnections) => {
  const onlineUsersData = Array.from(activeConnections.values())
    .filter((client) => client.readyState === client.OPEN)
    .map((client) => ({
      _id: client.userId,
      username: client.username,
      online: true,
    }));
  sendMessage(ws, 'online_users', onlineUsersData);
};

/**
 * แจ้งเตือนผู้ใช้อื่นๆ เกี่ยวกับการเปลี่ยนแปลงสถานะออนไลน์
 */
export const broadcastOnlineStatus = (
  userId,
  online,
  username,
  activeConnections
) => {
  activeConnections.forEach((client) => {
    if (client.userId !== userId && client.readyState === client.OPEN) {
      sendMessage(client, online ? 'user_online' : 'user_offline', {
        userId,
        username,
        online,
      });
    }
  });
};
