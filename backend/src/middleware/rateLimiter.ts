import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from '../config/env.js';
import { errorResponse } from '../utils/response.js';

export const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: errorResponse('Too many requests from this IP, please try again later', 42901),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json(
            errorResponse('Too many requests, please try again later', 42901)
        );
    }
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 5 requests per 15 minutes
    message: errorResponse('Too many authentication attempts, please try again later', 42902),
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json(
            errorResponse('Too many authentication attempts, please try again later', 42902)
        );
    }
});
