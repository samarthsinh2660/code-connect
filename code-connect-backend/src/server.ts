import express, { Application } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { PORT, getAllCorsOrigins, NODE_ENV } from './config/env.js';
import { connectDatabase } from './database/connection.js';
import { initializeSocketIO } from './services/socket.service.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import createLogger from './utils/logger.js';
import { successResponse } from './utils/response.js';
import rateLimit from 'express-rate-limit';

// Import routes directly (like inventory management system)
import roomRoutes from './routes/room.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';
import compilerRoutes from './routes/compiler.routes.js';

const logger = createLogger('@server');

async function startServer() {
    try {
        // Create Express app
        const app: Application = express();
        const httpServer = createServer(app);

        // Connect to database
        logger.info('Connecting to database...');
        await connectDatabase();
        logger.info('✅ Database connected');

        // Middleware
        app.use(cors({
            origin: getAllCorsOrigins(),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Apply global rate limiting (like inventory management system)
        app.use(apiLimiter);

        app.use(express.json({ limit: '10mb' }));
        app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Specific rate limiters for different services
        const compilerLimiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 10, // 10 compilation requests per minute
            message: { success: false, error: { message: 'Too many compilation requests', code: 42901, statusCode: 429 } },
            standardHeaders: true,
            legacyHeaders: false,
        });

        const aiLimiter = rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 20, // 20 AI requests per minute
            message: { success: false, error: { message: 'Too many AI requests', code: 70005, statusCode: 429 } },
            standardHeaders: true,
            legacyHeaders: false,
        });

        // Apply specific rate limiters to service endpoints
        app.use('/api/compiler', compilerLimiter);
        app.use('/api/ai', aiLimiter);

        // Initialize Socket.IO
        const io = initializeSocketIO(httpServer);
        logger.info('✅ Socket.IO initialized');

        // Mount API routes directly (like inventory management system)
        app.use('/api/auth', authRoutes);
        app.use('/api/rooms', roomRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/ai', aiRoutes);
        app.use('/api/compiler', compilerRoutes);
        logger.info('✅ API routes mounted');

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json(successResponse({
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                environment: NODE_ENV
            }, 'Server is running'));
        });

        // API status endpoint
        app.get('/api/status', (req, res) => {
            res.json(successResponse({
                service: 'Code Connect Backend',
                version: '1.0.0',
                socketIO: 'active',
                database: 'connected'
            }, 'API is operational'));
        });

        // Root endpoint
        app.get('/', (req, res) => {
            res.json({
                message: 'Code Connect Backend API',
                version: '1.0.0',
                documentation: '/api/status',
                socketIO: 'WebSocket server is running',
                endpoints: {
                    health: '/health',
                    status: '/api/status',
                    rooms: '/api/rooms',
                    users: '/api/users'
                }
            });
        });

        // 404 handler
        app.use(notFoundHandler);

        // Error handler (must be last)
        app.use(errorHandler);

        // Start server
        const server = httpServer.listen(PORT, () => {
            logger.info(`🚀 Code Connect Backend Server Started!`);
            logger.info(`📡 Environment: ${NODE_ENV}`);
            logger.info(`🔌 Port: ${PORT}`);
            logger.info(`⚡ Socket.IO: Active`);
            logger.info(`🗄️ Database: Connected`);
            logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
            logger.info(`📊 API Status: http://localhost:${PORT}/api/status`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => gracefulShutdown(server, io));
        process.on('SIGINT', () => gracefulShutdown(server, io));

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

async function gracefulShutdown(server: any, io: any) {
    logger.info('Shutting down gracefully...');

    // Stop accepting new connections
    server.close(() => {
        logger.info('HTTP server closed');
    });

    // Close Socket.IO connections
    io.close(() => {
        logger.info('Socket.IO server closed');
    });

    // Close database connection
    try {
        const { disconnectDatabase } = await import('./database/connection.js');
        await disconnectDatabase();
        logger.info('Database disconnected');
    } catch (error) {
        logger.error('Error disconnecting database:', error);
    }

    process.exit(0);
}

// Start the server
startServer();
