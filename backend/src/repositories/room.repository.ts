import { RoomModel, IRoom } from '../models/Room.model.js';
import { ERRORS } from '../utils/error.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@room-repository');

export class RoomRepository {
    async createRoom(roomId: string): Promise<IRoom> {
        try {
            const room = await RoomModel.create({
                roomId,
                clients: [],
                code: '// Start coding here...',
                language: 'javascript',
                messages: [],
                createdAt: new Date(),
                lastActivity: new Date(),
                isActive: true
            });
            logger.info(`Room created: ${roomId}`);
            return room;
        } catch (error: any) {
            logger.error('Error creating room:', error);
            if (error.code === 11000) {
                throw ERRORS.RESOURCE_ALREADY_EXISTS;
            }
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async findRoomById(roomId: string): Promise<IRoom | null> {
        try {
            const room = await RoomModel.findOne({ roomId, isActive: true });
            return room;
        } catch (error) {
            logger.error('Error finding room:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async updateRoomCode(roomId: string, code: string): Promise<IRoom | null> {
        try {
            const room = await RoomModel.findOneAndUpdate(
                { roomId, isActive: true },
                { code, lastActivity: new Date() },
                { new: true }
            );
            return room;
        } catch (error) {
            logger.error('Error updating room code:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async addClientToRoom(roomId: string, client: { socketId: string; username: string; joinedAt: Date }): Promise<IRoom | null> {
        try {
            const room = await RoomModel.findOneAndUpdate(
                { roomId, isActive: true },
                {
                    $push: { clients: client },
                    lastActivity: new Date()
                },
                { new: true }
            );
            return room;
        } catch (error) {
            logger.error('Error adding client to room:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async removeClientFromRoom(roomId: string, socketId: string): Promise<IRoom | null> {
        try {
            const room = await RoomModel.findOneAndUpdate(
                { roomId, isActive: true },
                {
                    $pull: { clients: { socketId } },
                    lastActivity: new Date()
                },
                { new: true }
            );
            return room;
        } catch (error) {
            logger.error('Error removing client from room:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async addMessageToRoom(roomId: string, message: { id: string; username: string; content: string; timestamp: Date }): Promise<IRoom | null> {
        try {
            const room = await RoomModel.findOneAndUpdate(
                { roomId, isActive: true },
                {
                    $push: { messages: message },
                    lastActivity: new Date()
                },
                { new: true }
            );
            return room;
        } catch (error) {
            logger.error('Error adding message to room:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async getAllActiveRooms(): Promise<IRoom[]> {
        try {
            const rooms = await RoomModel.find({ isActive: true })
                .sort({ lastActivity: -1 })
                .limit(100);
            return rooms;
        } catch (error) {
            logger.error('Error getting active rooms:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async deactivateRoom(roomId: string): Promise<IRoom | null> {
        try {
            const room = await RoomModel.findOneAndUpdate(
                { roomId },
                { isActive: false, lastActivity: new Date() },
                { new: true }
            );
            logger.info(`Room deactivated: ${roomId}`);
            return room;
        } catch (error) {
            logger.error('Error deactivating room:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }

    async deleteInactiveRooms(olderThan: Date): Promise<number> {
        try {
            const result = await RoomModel.deleteMany({
                isActive: false,
                lastActivity: { $lt: olderThan }
            });
            logger.info(`Deleted ${result.deletedCount} inactive rooms`);
            return result.deletedCount || 0;
        } catch (error) {
            logger.error('Error deleting inactive rooms:', error);
            throw ERRORS.DATABASE_ERROR;
        }
    }
}

export default new RoomRepository();
