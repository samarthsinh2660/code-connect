import { Router } from 'express';
import roomController from '../controllers/room.controller.js';

const router = Router();

/**
 * @route   POST /api/rooms
 * @desc    Create a new room
 * @access  Public
 */
router.post('/', roomController.createRoom.bind(roomController));

/**
 * @route   GET /api/rooms
 * @desc    Get all active rooms
 * @access  Public
 */
router.get('/', roomController.getAllRooms.bind(roomController));

/**
 * @route   GET /api/rooms/:roomId
 * @desc    Get room by ID
 * @access  Public
 */
router.get('/:roomId', roomController.getRoomById.bind(roomController));

/**
 * @route   PUT /api/rooms/:roomId/code
 * @desc    Update room code
 * @access  Public
 */
router.put('/:roomId/code', roomController.updateRoomCode.bind(roomController));

/**
 * @route   DELETE /api/rooms/:roomId
 * @desc    Deactivate a room
 * @access  Public
 */
router.delete('/:roomId', roomController.deactivateRoom.bind(roomController));

export default router;
