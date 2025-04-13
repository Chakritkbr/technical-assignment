import express from 'express';
import {
  sendPrivateMessage,
  sendRoomMessage,
  getPrivateMessages,
  getRoomMessages,
} from '../controllers/message.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/private', sendPrivateMessage);
router.post('/rooms/:roomId', sendRoomMessage);
router.get('/private/:userId', getPrivateMessages);
router.get('/rooms/:roomId', getRoomMessages);

export default router;
