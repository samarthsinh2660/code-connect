import { Request, Response, NextFunction } from 'express';
import { decodeAuthToken } from '../utils/jwt.js';
import { ERRORS } from '../utils/error.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@auth-middleware');

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ERRORS.NO_AUTH_TOKEN;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Decode and verify token
            const decoded = decodeAuthToken(token);
            
            // Attach user data to request
            req.user = decoded;
            
            next();
        } catch (error) {
            logger.warn('Invalid auth token:', error);
            throw ERRORS.INVALID_AUTH_TOKEN;
        }
    } catch (error) {
        next(error);
    }
};

// Optional authentication - doesn't throw error if no token
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            
            try {
                const decoded = decodeAuthToken(token);
                req.user = decoded;
            } catch (error) {
                // Silently fail for optional auth
                logger.debug('Optional auth failed');
            }
        }
        
        next();
    } catch (error) {
        next(error);
    }
};
