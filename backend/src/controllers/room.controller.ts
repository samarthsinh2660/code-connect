import { Request, Response, NextFunction } from 'express';
import roomRepository from '../repositories/room.repository.js';
import { successResponse, listResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@room-controller');

export class RoomController {
    async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roomId } = req.body;

            if (!roomId) {
                throw ERRORS.INVALID_REQUEST_BODY;
            }

            // Check if room already exists
            const existingRoom = await roomRepository.findRoomById(roomId);
            if (existingRoom) {
                res.json(successResponse(existingRoom, 'Room already exists'));
                return;
            }

            const room = await roomRepository.createRoom(roomId);
            logger.info(`Room created successfully: ${roomId}`);
            res.status(201).json(successResponse(room, 'Room created successfully'));
        } catch (error) {
            next(error);
        }
    }

    async getRoomById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roomId } = req.params;

            if (!roomId) {
                throw ERRORS.INVALID_PARAMS;
            }

            const room = await roomRepository.findRoomById(roomId);
            if (!room) {
                throw ERRORS.ROOM_NOT_FOUND;
            }

            res.json(successResponse(room, 'Room retrieved successfully'));
        } catch (error) {
            next(error);
        }
    }

    async getAllRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rooms = await roomRepository.getAllActiveRooms();
            res.json(listResponse(rooms, 'Rooms retrieved successfully'));
        } catch (error) {
            next(error);
        }
    }

    async updateRoomCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roomId } = req.params;
            const { code } = req.body;

            if (!roomId || !code) {
                throw ERRORS.INVALID_REQUEST_BODY;
            }

            const room = await roomRepository.updateRoomCode(roomId, code);
            if (!room) {
                throw ERRORS.ROOM_NOT_FOUND;
            }

            res.json(successResponse(room, 'Room code updated successfully'));
        } catch (error) {
            next(error);
        }
    }

    async deactivateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { roomId } = req.params;

            if (!roomId) {
                throw ERRORS.INVALID_PARAMS;
            }

            const room = await roomRepository.deactivateRoom(roomId);
            if (!room) {
                throw ERRORS.ROOM_NOT_FOUND;
            }

            res.json(successResponse(room, 'Room deactivated successfully'));
        } catch (error) {
            next(error);
        }
    }
}

export default new RoomController();
