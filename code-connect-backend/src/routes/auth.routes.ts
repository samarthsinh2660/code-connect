import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with email/password
 * @access  Public
 */
router.post('/register', authLimiter, authController.register.bind(authController));

/**
 * @route   POST /api/auth/login
 * @desc    Login with email/password
 * @access  Public
 */
router.post('/login', authLimiter, authController.login.bind(authController));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user (requires JWT token)
 * @access  Private
 */
router.get('/me', authController.getCurrentUser.bind(authController));

export default router;
