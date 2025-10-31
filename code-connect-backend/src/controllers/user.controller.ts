import { Request, Response, NextFunction } from 'express';
import userRepository from '../repositories/user.repository.js';
import { successResponse, listResponse, createdResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@user-controller');

export class UserController {
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, email, password } = req.body;

            if (!username) {
                throw ERRORS.INVALID_REQUEST_BODY;
            }

            // Validate username format (alphanumeric and underscores only)
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            if (!usernameRegex.test(username)) {
                throw ERRORS.INVALID_USERNAME_FORMAT;
            }

            const user = await userRepository.createUser({ username, email, password });
            
            // Remove sensitive data
            const userResponse = {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            };

            logger.info(`User created successfully: ${username}`);

            res.status(201).json(createdResponse(userResponse, 'User created successfully'));
        } catch (error) {
            next(error);
        }
    }

    async getUserByUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params;

            if (!username) {
                throw ERRORS.INVALID_PARAMS;
            }

            const user = await userRepository.findUserByUsername(username);
            if (!user) {
                throw ERRORS.USER_NOT_FOUND;
            }

            // Remove sensitive data
            const userResponse = {
                id: user._id,
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

    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 100;
            const users = await userRepository.getAllUsers(limit);

            // Remove sensitive data
            const usersResponse = users.map(user => ({
                id: user._id,
                username: user.username,
                email: user.email,
                currentRoom: user.currentRoom,
                lastSeen: user.lastSeen
            }));

            res.json(listResponse(usersResponse, 'Users retrieved successfully'));
        } catch (error) {
            next(error);
        }
    }

    async updateUserRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params;
            const { roomId } = req.body;

            if (!username) {
                throw ERRORS.INVALID_PARAMS;
            }

            const user = await userRepository.updateUserRoom(username, roomId);
            if (!user) {
                throw ERRORS.USER_NOT_FOUND;
            }

            const userResponse = {
                id: user._id,
                username: user.username,
                currentRoom: user.currentRoom,
                lastSeen: user.lastSeen
            };

            res.json(successResponse(userResponse, 'User room updated successfully'));
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params;

            if (!username) {
                throw ERRORS.INVALID_PARAMS;
            }

            const deleted = await userRepository.deleteUser(username);
            if (!deleted) {
                throw ERRORS.USER_NOT_FOUND;
            }

            res.json(successResponse(null, 'User deleted successfully'));
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
