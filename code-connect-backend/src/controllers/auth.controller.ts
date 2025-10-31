import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/user.repository.js';
import { successResponse, authResponse } from '../utils/response.js';
import { createAuthToken, createRefreshToken } from '../utils/jwt.js';
import { ERRORS } from '../utils/error.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@auth-controller');

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                throw ERRORS.INVALID_REQUEST_BODY;
            }

            // Validate username format
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            if (!usernameRegex.test(username)) {
                throw ERRORS.INVALID_USERNAME_FORMAT;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw ERRORS.INVALID_EMAIL_FORMAT;
            }

            // Validate password strength
            if (password.length < 8) {
                throw ERRORS.INVALID_PASSWORD_FORMAT;
            }

            // Check if user already exists
            const existingUser = await userRepository.findUserByUsername(username);
            if (existingUser) {
                throw ERRORS.USERNAME_ALREADY_EXISTS;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await userRepository.createUser({
                username,
                email,
                password: hashedPassword
            });

            // Generate tokens
            const authToken = createAuthToken({
                userId: String(user._id),
                username: user.username,
                email: user.email
            });

            const refreshToken = createRefreshToken({
                userId: String(user._id),
                username: user.username
            });

            // Remove password from response
            const userResponse = {
                id: String(user._id),
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            };

            logger.info(`New user registered: ${username}`);

            res.status(201).json(authResponse(userResponse, authToken, refreshToken, 'Registration successful'));
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                throw ERRORS.INVALID_REQUEST_BODY;
            }

            // Find user
            const user = await userRepository.findUserByUsername(username);
            if (!user || !user.password) {
                throw ERRORS.INVALID_CREDENTIALS;
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw ERRORS.INVALID_CREDENTIALS;
            }

            // Update last seen
            await userRepository.updateLastSeen(username);

            // Generate tokens
            const authToken = createAuthToken({
                userId: String(user._id),
                username: user.username,
                email: user.email
            });

            const refreshToken = createRefreshToken({
                userId: String(user._id),
                username: user.username
            });

            // Remove password from response
            const userResponse = {
                id: String(user._id),
                username: user.username,
                email: user.email,
                currentRoom: user.currentRoom,
                lastSeen: user.lastSeen
            };

            logger.info(`User logged in: ${username}`);

            res.json(authResponse(userResponse, authToken, refreshToken, 'Login successful'));
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, _res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                throw ERRORS.NO_AUTH_TOKEN;
            }

            // This would need decodeRefreshToken implementation
            // For now, we'll keep it simple
            throw ERRORS.INVALID_AUTH_TOKEN;
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (userId) {
                logger.info(`User logged out: ${userId}`);
            }

            res.json(successResponse(null, 'Logout successful'));
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw ERRORS.NO_AUTH_TOKEN;
            }

            const user = await userRepository.findUserById(userId);
            if (!user) {
                throw ERRORS.USER_NOT_FOUND;
            }

            const userResponse = {
                id: String(user._id),
                username: user.username,
                email: user.email,
                currentRoom: user.currentRoom,
                lastSeen: user.lastSeen,
                createdAt: user.createdAt
            };

            res.json(successResponse(userResponse, 'User retrieved successfully'));
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
