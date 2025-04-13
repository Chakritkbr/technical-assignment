export const parseMessage = (data) => {
  try {
    return JSON.parse(data.toString());
  } catch (err) {
    throw new Error('Invalid JSON format');
  }
};

export const sendMessage = (ws, event, data) => {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
};

export const broadcastToUsers = (userIds, event, data, activeConnections) => {
  userIds.forEach((userId) => {
    if (activeConnections.has(userId.toString())) {
      const client = activeConnections.get(userId.toString());

      sendMessage(client, event, data);
    }
  });
};

export const broadcastToRoom = (roomId, event, data, activeConnections) => {
  activeConnections.forEach((client) => {
    if (client.currentRoom === roomId && client.readyState === client.OPEN) {
      sendMessage(client, event, data);
    }
  });
};

export const sendError = (ws, message) => {
  sendMessage(ws, 'error', { message });
};

export const setupHeartbeat = (ws) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('ping', () => {});
};
