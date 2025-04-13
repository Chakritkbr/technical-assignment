import jwt from 'jsonwebtoken';
import { APIResponse } from '../utils/apiResponse.js';

export const authenticate = (req, res, next) => {
  const token =
    req.cookies?.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return APIResponse.error(res, 'Authentication required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return APIResponse.error(res, 'Invalid or expired token', 403);
  }
};
