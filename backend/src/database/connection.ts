import mongoose from 'mongoose';
import { MONGODB_URI, DB_NAME } from '../config/env.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@database');

let isConnected = false;

export async function connectDatabase(): Promise<void> {
    if (isConnected) {
        logger.info('Using existing database connection');
        return;
    }

    try {
        logger.info('Connecting to MongoDB...');
        
        const conn = await mongoose.connect(MONGODB_URI, {
            dbName: DB_NAME,
            maxPoolSize: 10,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
            isConnected = true;
        });

    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        isConnected = false;
        throw error;
    }
}

export async function disconnectDatabase(): Promise<void> {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        logger.info('MongoDB disconnected successfully');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error);
        throw error;
    }
}

export function getDatabaseConnection() {
    return mongoose.connection;
}

export { isConnected };
