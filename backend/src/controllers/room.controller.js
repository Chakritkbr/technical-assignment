import Room from '../models/room.model.js';
import User from '../models/user.model.js';
import { APIResponse } from '../utils/apiResponse.js';

export const createRoom = async (req, res, next) => {
  try {
    const { name, description, userIds } = req.body;

    let members = [req.user.userId];
    if (userIds && userIds.length > 0) {
      members = [...members, ...userIds];
    }

    const room = await Room.create({
      name,
      description,
      admin: req.user.userId,
      members: members,
    });
    return APIResponse.success(res, room, 'Room created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const room = await Room.find({
      members: req.user.userId,
    })
      .populate({ path: 'members', select: 'username online' })
      .populate({ path: 'admin', select: 'username online' });
    return APIResponse.success(res, room, 'Room retrieve successfully');
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findOne({
      _id: req.params.id,
      members: req.user.userId,
    }).populate('members', 'username online');

    if (!room) {
      return APIResponse.error(res, 'Room not found or access denied', 404);
    }
    return APIResponse.success(res, room, 'Room details successfully');
  } catch (error) {
    next(error);
  }
};

export const joinRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return APIResponse.error(res, 'Room not found', 404);
    }
    if (room.members.includes(req.user.userId)) {
      return APIResponse.error(res, 'Already a member of the room', 400);
    }

    room.members.push(req.user.userId);
    await room.save();

    return APIResponse.success(
      res,
      { roomId: room._id, name: room.name },
      'Joined room successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const leaveRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return APIResponse.error(res, 'Room not found', 404);
    }

    if (!room.members.includes(req.user.userId)) {
      return APIResponse.error(res, 'Not a member of this room', 400);
    }

    if (room.admin.equals(req.user.userId) && room.members.length === 1) {
      await Room.findByIdAndDelete(req.params.id);
      return APIResponse.success(
        res,
        null,
        'Room deleted as you were the last member'
      );
    }

    if (room.admin.equals(req.user.userId)) {
      room.admin = room.members.find(
        (member) => !member.equals(req.user.userId)
      );
    }

    room.members = room.members.filter(
      (member) => !member.equals(req.user.userId)
    );
    await room.save();

    return APIResponse.success(res, null, 'Successfully left the room');
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findOneAndDelete({
      _id: req.params.id,
      admin: req.user.userId,
    });

    if (!room) {
      return APIResponse.error(res, 'Room not found or not authorized', 404);
    }

    return APIResponse.success(res, null, 'Room deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const manageMembers = async (req, res, next) => {
  try {
    const { action, userId } = req.body;

    const room = await Room.findOne({
      _id: req.params.id,
      admin: req.user.userId,
    });

    if (!room) {
      return APIResponse.error(res, 'Room not found or not authorized', 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      return APIResponse.error(res, 'User not found', 404);
    }

    if (action === 'add') {
      if (room.members.includes(userId)) {
        return APIResponse.error(res, 'User already in room', 400);
      }
      room.members.push(userId);
    } else if (action === 'remove') {
      if (room.admin.equals(userId)) {
        return APIResponse.error(res, 'Cannot remove room admin', 400);
      }
      room.members = room.members.filter((member) => !member.equals(userId));
    } else {
      return APIResponse.error(res, 'Invalid action', 400);
    }

    await room.save();

    return APIResponse.success(
      res,
      { members: room.members },
      `User ${action === 'add' ? 'added to' : 'removed from'} room`
    );
  } catch (error) {
    next(error);
  }
};

export const getAvailableRooms = async (req, res, next) => {
  try {
    console.log('Function getAvailableRooms is being called!');
    const user = req.user;

    const allRooms = await Room.find()
      .populate({ path: 'members', select: 'username online' })
      .populate({ path: 'admin', select: 'username online' });

    const availableRooms = allRooms.filter((room) => {
      return !room.members.some((member) => member._id.equals(user.userId));
    });

    return APIResponse.success(
      res,
      availableRooms,
      'Available rooms retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};
