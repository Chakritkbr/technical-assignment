import express from 'express';
import {
  createRoom,
  getRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
  deleteRoom,
  manageMembers,
  getAvailableRooms,
} from '../controllers/room.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.route('/').get(getRooms).post(createRoom);

router.route('/available').get(getAvailableRooms);

router.route('/:id').get(getRoomById).delete(deleteRoom);

router.post('/:id/join', joinRoom);
router.delete('/:id/leave', leaveRoom);
router.post('/:id/members', manageMembers);

export default router;
