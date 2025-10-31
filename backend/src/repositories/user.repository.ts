import { UserModel, IUser } from '../models/User.model.js';
import { ERRORS } from '../utils/error.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@user-repository');

export class UserRepository {
    async createUser(userData: { username: string; email?: string; password?: string }): Promise<IUser> {
        try {
            const user = await UserModel.create({
                ...userData,
                lastSeen: new Date(),
                createdAt: new Date()
            });
            logger.info(`User created: ${userData.username}`);
            return user;
        } catch (error: any) {
            logger.error('Error creating user:', error);
            if (error.code === 11000) {
                if (error.keyPattern?.username) {
                    throw ERRORS.USERNAME_ALREADY_EXISTS;
                }
                if (error.keyPattern?.email) {
                    throw ERRORS.EMAIL_ALREADY_EXISTS;
                }
            }
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async findUserByUsername(username: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ username });
            return user;
        } catch (error) {
            logger.error('Error finding user by username:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async findUserById(userId: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findById(userId);
            return user;
        } catch (error) {
            logger.error('Error finding user by ID:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async findUserBySocketId(socketId: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ socketId });
            return user;
        } catch (error) {
            logger.error('Error finding user by socket ID:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async updateUserSocketId(username: string, socketId: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOneAndUpdate(
                { username },
                { socketId, lastSeen: new Date() },
                { new: true, upsert: true }
            );
            return user;
        } catch (error) {
            logger.error('Error updating user socket ID:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async updateUserRoom(username: string, roomId: string | null): Promise<IUser | null> {
        try {
            const user = await UserModel.findOneAndUpdate(
                { username },
                { currentRoom: roomId, lastSeen: new Date() },
                { new: true }
            );
            return user;
        } catch (error) {
            logger.error('Error updating user room:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async updateLastSeen(username: string): Promise<IUser | null> {
        try {
            const user = await UserModel.findOneAndUpdate(
                { username },
                { lastSeen: new Date() },
                { new: true }
            );
            return user;
        } catch (error) {
            logger.error('Error updating last seen:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async getAllUsers(limit: number = 100): Promise<IUser[]> {
        try {
            const users = await UserModel.find()
                .sort({ lastSeen: -1 })
                .limit(limit)
                .select('-password');
            return users;
        } catch (error) {
            logger.error('Error getting all users:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async deleteUser(username: string): Promise<boolean> {
        try {
            const result = await UserModel.deleteOne({ username });
            if (result.deletedCount > 0) {
                logger.info(`User deleted: ${username}`);
                return true;
            }
            return false;
        } catch (error) {
            logger.error('Error deleting user:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }
}

export default new UserRepository();
