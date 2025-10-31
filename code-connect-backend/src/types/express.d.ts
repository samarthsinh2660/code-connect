import { TokenData } from '../utils/jwt.js';

declare global {
    namespace Express {
        interface Request {
            user?: TokenData;
        }
    }
}

export {};
