import winston from 'winston';
import { NODE_ENV } from '../config/env.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    
    // Add stack trace for errors
    if (stack) {
        msg += `\n${stack}`;
    }
    
    return msg;
});

// Create the logger
const logger = winston.createLogger({
    level: NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Console transport
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),
        // File transport for errors
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ],
    exitOnError: false
});

// Create logger with context
export default function createLogger(context: string) {
    return {
        info: (message: string, meta?: any) => logger.info(message, { context, ...meta }),
        error: (message: string, meta?: any) => logger.error(message, { context, ...meta }),
        warn: (message: string, meta?: any) => logger.warn(message, { context, ...meta }),
        debug: (message: string, meta?: any) => logger.debug(message, { context, ...meta }),
    };
}

export { logger };
