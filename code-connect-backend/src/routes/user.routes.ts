import { Router } from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', userController.createUser.bind(userController));

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', userController.getAllUsers.bind(userController));

/**
 * @route   GET /api/users/:username
 * @desc    Get user by username
 * @access  Public
 */
router.get('/:username', userController.getUserByUsername.bind(userController));

/**
 * @route   PUT /api/users/:username/room
 * @desc    Update user's current room
 * @access  Public
 */
router.put('/:username/room', userController.updateUserRoom.bind(userController));

/**
 * @route   DELETE /api/users/:username
 * @desc    Delete a user
 * @access  Public
 */
router.delete('/:username', userController.deleteUser.bind(userController));

export default router;
