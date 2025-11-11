import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { getAllCorsOrigins } from '../config/env.js';
import { SOCKET_ACTIONS } from '../types/socket.js';
import { RoomModel } from '../models/Room.model.js';
import createLogger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('@socket');

// In-memory storage for active rooms (can be replaced with Redis for production)
const rooms = new Map<string, any>();

export function initializeSocketIO(httpServer: HTTPServer): SocketServer {
    const io = new SocketServer(httpServer, {
        cors: {
            origin: getAllCorsOrigins(),
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    logger.info('Socket.IO server initialized');

    io.on('connection', (socket: Socket) => {
        const username = socket.handshake.auth.username || 'Anonymous';
        logger.info(`🔌 New connection: ${socket.id} (${username})`);

        // JOIN room
        socket.on(SOCKET_ACTIONS.JOIN, async ({ id: roomId, user }) => {
            try {
                logger.info(`User ${user} joining room ${roomId}`);

                // Join the socket room
                socket.join(roomId);

                // Get or create room data
                let roomData = rooms.get(roomId);
                if (!roomData) {
                    // Try to load existing room from DB first
                    let existingRoom = null;
                    try {
                        existingRoom = await RoomModel.findOne({ roomId });
                    } catch (dbError) {
                        logger.warn('Failed to load room from DB:', dbError);
                    }

                    // Create room data with existing messages if room was in DB
                    roomData = {
                        roomId,
                        clients: [],
                        code: existingRoom?.code || '// Start coding here...',
                        language: existingRoom?.language || 'javascript',
                        messages: existingRoom?.messages || [],
                        createdAt: existingRoom?.createdAt || new Date(),
                        lastActivity: new Date()
                    };
                    rooms.set(roomId, roomData);

                    // Save to database (upsert to handle existing rooms)
                    try {
                        await RoomModel.findOneAndUpdate(
                            { roomId },
                            {
                                $setOnInsert: {
                                    roomId,
                                    code: roomData.code,
                                    language: roomData.language,
                                    messages: roomData.messages,
                                    createdAt: roomData.createdAt
                                },
                                lastActivity: new Date(),
                                isActive: true
                            },
                            { upsert: true, new: true }
                        );
                        logger.info(`Room ${roomId} loaded with ${roomData.messages.length} existing messages`);
                    } catch (dbError) {
                        logger.warn('Failed to save room to DB:', dbError);
                    }
                }

                // Add client to room
                const clientExists = roomData.clients.some((c: any) => c.socketId === socket.id);
                if (!clientExists) {
                    roomData.clients.push({
                        socketId: socket.id,
                        username: user,
                        joinedAt: new Date()
                    });
                }

                // Send confirmation to the joining user FIRST with all current clients
                socket.emit(SOCKET_ACTIONS.JOINED, {
                    clients: roomData.clients,
                    user,
                    socketId: socket.id,
                    isSelf: true // Flag to indicate this is the joining user
                });

                // Then notify OTHER clients about the new user
                socket.to(roomId).emit(SOCKET_ACTIONS.JOINED, {
                    clients: roomData.clients,
                    user,
                    socketId: socket.id
                });

                // Sync current code to new user
                socket.emit(SOCKET_ACTIONS.SYNC_CODE, {
                    code: roomData.code
                });

                // Sync messages to new user
                socket.emit(SOCKET_ACTIONS.SYNC_MESSAGES, {
                    messages: roomData.messages
                });

                logger.info(`✅ User ${user} joined room ${roomId}. Total clients: ${roomData.clients.length}`);

            } catch (error) {
                logger.error('Error joining room:', error);
                socket.emit(SOCKET_ACTIONS.ERROR, { message: 'Failed to join room' });
            }
        });

        // CODE CHANGE
        socket.on(SOCKET_ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
            try {
                const roomData = rooms.get(roomId);
                if (roomData) {
                    roomData.code = code;
                    roomData.lastActivity = new Date();

                    // Broadcast to all clients except sender
                    socket.to(roomId).emit(SOCKET_ACTIONS.CODE_CHANGE, { code });

                    // Update DB in background
                    try {
                        await RoomModel.findOneAndUpdate(
                            { roomId },
                            { code, lastActivity: new Date() },
                            { upsert: true }
                        );
                    } catch (dbError) {
                        logger.warn('Failed to update code in DB:', dbError);
                    }
                }
            } catch (error) {
                logger.error('Error handling code change:', error);
            }
        });

        // TYPING indicator
        socket.on(SOCKET_ACTIONS.TYPING, ({ roomId, username }) => {
            socket.to(roomId).emit(SOCKET_ACTIONS.TYPING, { username });
        });

        // STOP TYPING
        socket.on(SOCKET_ACTIONS.STOP_TYPING, ({ roomId, username }) => {
            socket.to(roomId).emit(SOCKET_ACTIONS.STOP_TYPING, { username });
        });

        // SEND MESSAGE
        socket.on(SOCKET_ACTIONS.SEND_MESSAGE, async ({ roomId, message }) => {
            try {
                const roomData = rooms.get(roomId);
                if (roomData) {
                    const newMessage = {
                        id: uuidv4(),
                        username: message.sender,
                        content: message.content,
                        timestamp: new Date()
                    };

                    roomData.messages.push(newMessage);
                    roomData.lastActivity = new Date();

                    // Broadcast to all clients in room
                    io.to(roomId).emit(SOCKET_ACTIONS.RECEIVE_MESSAGE, newMessage);

                    // Update DB in background
                    try {
                        await RoomModel.findOneAndUpdate(
                            { roomId },
                            { 
                                $push: { messages: newMessage },
                                lastActivity: new Date()
                            },
                            { upsert: true }
                        );
                    } catch (dbError) {
                        logger.warn('Failed to save message to DB:', dbError);
                    }

                    logger.debug(`Message sent in room ${roomId} by ${message.sender}`);
                }
            } catch (error) {
                logger.error('Error sending message:', error);
            }
        });

        // WHITEBOARD DRAW
        socket.on(SOCKET_ACTIONS.WHITEBOARD_DRAW, ({ roomId, action }) => {
            try {
                const roomData = rooms.get(roomId);
                if (roomData) {
                    if (!roomData.whiteboard) {
                        roomData.whiteboard = { actions: [] };
                    }
                    roomData.whiteboard.actions.push(action);
                    roomData.lastActivity = new Date();

                    // Broadcast to all clients except sender
                    socket.to(roomId).emit(SOCKET_ACTIONS.WHITEBOARD_DRAW, { action });

                    logger.debug(`Whiteboard draw in room ${roomId}`);
                }
            } catch (error) {
                logger.error('Error handling whiteboard draw:', error);
            }
        });

        // WHITEBOARD CLEAR
        socket.on(SOCKET_ACTIONS.WHITEBOARD_CLEAR, ({ roomId }) => {
            try {
                const roomData = rooms.get(roomId);
                if (roomData) {
                    roomData.whiteboard = { actions: [] };
                    roomData.lastActivity = new Date();

                    // Broadcast to all clients in room
                    io.to(roomId).emit(SOCKET_ACTIONS.WHITEBOARD_CLEAR);

                    logger.debug(`Whiteboard cleared in room ${roomId}`);
                }
            } catch (error) {
                logger.error('Error clearing whiteboard:', error);
            }
        });

        // WHITEBOARD SYNC (when user joins)
        socket.on(SOCKET_ACTIONS.WHITEBOARD_SYNC_REQUEST, ({ roomId }) => {
            try {
                const roomData = rooms.get(roomId);
                if (roomData && roomData.whiteboard) {
                    socket.emit(SOCKET_ACTIONS.WHITEBOARD_SYNC, {
                        actions: roomData.whiteboard.actions || []
                    });
                    logger.debug(`Whiteboard synced for room ${roomId}`);
                }
            } catch (error) {
                logger.error('Error syncing whiteboard:', error);
            }
        });

        // COMPILE code
        socket.on(SOCKET_ACTIONS.COMPILE, async ({ roomId, code, language }) => {
            try {
                logger.info(`Compiling ${language} code in room ${roomId}`);

                // Simple JavaScript execution (for demo purposes)
                // In production, use a sandboxed environment or external service
                if (language === 'javascript') {
                    try {
                        // Capture console output
                        const logs: string[] = [];
                        const mockConsole = {
                            log: (...args: any[]) => {
                                logs.push(args.map(arg => 
                                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                                ).join(' '));
                            }
                        };

                        // Execute code in limited scope
                        const func = new Function('console', code);
                        func(mockConsole);

                        const result = logs.join('\n') || 'Code executed successfully (no output)';
                        
                        socket.emit(SOCKET_ACTIONS.COMPILE_RESULT, { result });
                        logger.info(`✅ Code compiled successfully`);

                    } catch (execError: any) {
                        socket.emit(SOCKET_ACTIONS.COMPILE_RESULT, { 
                            error: `Error: ${execError.message}` 
                        });
                        logger.error('Code execution error:', execError);
                    }
                } else {
                    // For other languages, return a placeholder
                    socket.emit(SOCKET_ACTIONS.COMPILE_RESULT, { 
                        result: `Code execution for ${language} is not yet implemented. This requires a code execution service.` 
                    });
                }

            } catch (error) {
                logger.error('Error compiling code:', error);
                socket.emit(SOCKET_ACTIONS.COMPILE_RESULT, { 
                    error: 'Failed to compile code' 
                });
            }
        });

        // LEAVE room
        socket.on(SOCKET_ACTIONS.LEAVE, ({ roomId }) => {
            handleDisconnect(socket, roomId);
        });

        // DISCONNECT
        socket.on('disconnect', () => {
            logger.info(`🔌 Disconnected: ${socket.id}`);
            
            // Find and remove user from all rooms
            rooms.forEach((roomData, roomId) => {
                handleDisconnect(socket, roomId);
            });
        });

        // Helper function to handle disconnect
        async function handleDisconnect(socket: Socket, roomId: string) {
            const roomData = rooms.get(roomId);
            if (roomData) {
                const client = roomData.clients.find((c: any) => c.socketId === socket.id);
                
                if (client) {
                    // Remove client from room
                    roomData.clients = roomData.clients.filter((c: any) => c.socketId !== socket.id);

                    // Leave socket room
                    socket.leave(roomId);

                    // Notify other clients
                    socket.to(roomId).emit(SOCKET_ACTIONS.DISCONNECTED, {
                        socketId: socket.id,
                        user: client.username,
                        clients: roomData.clients
                    });

                    logger.info(`User ${client.username} left room ${roomId}. Remaining: ${roomData.clients.length}`);

                    // Clean up empty rooms and delete chat history
                    if (roomData.clients.length === 0) {
                        rooms.delete(roomId);
                        logger.info(`Room ${roomId} is now empty - deleting chat history`);

                        // Delete chat messages from DB when room becomes empty
                        try {
                            await RoomModel.findOneAndUpdate(
                                { roomId },
                                { 
                                    messages: [],
                                    clients: [],
                                    lastActivity: new Date(),
                                    isActive: false
                                }
                            );
                            logger.info(`Chat history deleted for empty room ${roomId}`);
                        } catch (dbError) {
                            logger.warn('Failed to delete chat history:', dbError);
                        }
                    } else {
                        // Update DB in background if room still has users
                        try {
                            RoomModel.findOneAndUpdate(
                                { roomId },
                                { 
                                    clients: roomData.clients,
                                    lastActivity: new Date(),
                                    isActive: true
                                }
                            ).catch(err => logger.warn('Failed to update room in DB:', err));
                        } catch (dbError) {
                            logger.warn('Failed to update room on disconnect:', dbError);
                        }
                    }
                }
            }
        }
    });

    // Periodic cleanup of inactive rooms (every 30 minutes)
    setInterval(() => {
        cleanupInactiveRooms();
    }, 30 * 60 * 1000);

    return io;
}

async function cleanupInactiveRooms() {
    try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        // Cleanup in-memory rooms
        rooms.forEach((roomData, roomId) => {
            if (roomData.lastActivity < thirtyMinutesAgo && roomData.clients.length === 0) {
                rooms.delete(roomId);
                logger.info(`Cleaned up inactive room: ${roomId}`);
            }
        });

        // Cleanup database rooms - delete messages from inactive empty rooms
        const result = await RoomModel.updateMany(
            { 
                lastActivity: { $lt: thirtyMinutesAgo },
                'clients.0': { $exists: false }
            },
            { 
                isActive: false,
                messages: [] // Clear chat history for inactive rooms
            }
        );

        if (result.modifiedCount > 0) {
            logger.info(`Marked ${result.modifiedCount} rooms as inactive and cleared chat history in DB`);
        }
    } catch (error) {
        logger.error('Error cleaning up inactive rooms:', error);
    }
}
