import Message from '../models/message.model.js';
import Room from '../models/room.model.js';
import { APIResponse } from '../utils/apiResponse.js';

export const sendPrivateMessage = async (req, res, next) => {
  const { recipientId, content } = req.body;

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return APIResponse.error(res, 'Recipient not found', 404);
  }

  const message = await Message.create({
    content,
    sender: req.user.userId,
    recipient: recipientId,
  });

  await message.populate('sender', 'username avatar');

  return APIResponse.success(res, message, 'Private message sent successfully');
};

export const sendRoomMessage = async (req, res, next) => {
  const { roomId } = req.params;
  const { content } = req.body;

  const room = await Room.findOne({
    _id: roomId,
    members: req.user.userId,
  });
  if (!room) {
    return APIResponse.error(res, 'Not a member of this room', 403);
  }

  const message = await Message.create({
    content,
    sender: req.user.userId,
    room: roomId,
  });

  room.lastMessage = message._id;
  await room.save();

  await message.populate('sender', 'username avatar');

  return APIResponse.success(res, message, 'Room message sent successfully');
};

export const getPrivateMessages = async (req, res, next) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user.userId, recipient: userId },
      { sender: userId, recipient: req.user.userId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'username avatar')
    .populate('recipient', 'username avatar');

  return APIResponse.success(res, messages, 'Private messages retrieved');
};

export const getRoomMessages = async (req, res, next) => {
  const { roomId } = req.params;

  const isMember = await Room.exists({
    _id: roomId,
    members: req.user.userId,
  });
  if (!isMember) {
    return APIResponse.error(res, 'Not a member of this room', 403);
  }

  const messages = await Message.find({ room: roomId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('sender', 'username avatar');

  return APIResponse.success(
    res,
    messages.reverse(),
    'Room messages retrieved'
  );
};
