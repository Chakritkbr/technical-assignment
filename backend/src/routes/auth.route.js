import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  getUsers,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.get('/getusers', authenticate, getUsers);

export default router;
