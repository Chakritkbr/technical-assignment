import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { APIResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json(new APIResponse(null, 'User already exists', false));
    }

    const user = await User.create({ username, password });

    const token = jwt.sign(
      { userId: user._id, username: username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    const userResponse = {
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    };
    return APIResponse.success(
      res,
      { user: userResponse, token },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await await user.isCorrectPassword(password))) {
      return res
        .status(401)
        .json(new APIResponse(null, 'Invalid credentials', false));
    }

    user.online = true;
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        username: username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    const userResponse = {
      _id: user._id,
      username: user.username,
      online: user.online,
    };

    return APIResponse.success(
      res,
      { user: userResponse, token },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user?.userId) {
      await User.findByIdAndUpdate(req.user.userId, { online: false });
    }
    res.clearCookie('token');

    return APIResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');
    if (!user) {
      return APIResponse.error(res, null, 'User not found', 404);
    }
    return APIResponse.success(res, user, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('username online _id')
      .sort({ online: -1, username: 1 });

    return APIResponse.success(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};
