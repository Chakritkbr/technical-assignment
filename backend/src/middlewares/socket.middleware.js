import jwt from 'jsonwebtoken';

export const verifyToken = async (token) => {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      throw new Error('Token expired');
    }
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};
