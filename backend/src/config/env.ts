import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look for the .env file in the project root
const envPath = path.join(__dirname, '..', '..', `.env`);
const result = config({ path: envPath });

if (result.error) {
  console.warn(`Warning: Environment file not found at ${envPath}. Using defaults.`);
}

// Server Configuration
export const PORT = process.env.PORT || '5000';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

// Database Configuration
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/code-connect';
export const DB_NAME = process.env.DB_NAME || 'code_connect';

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// CORS Configuration
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
export const CORS_ORIGIN1 = process.env.CORS_ORIGIN1;
export const CORS_ORIGIN2 = process.env.CORS_ORIGIN2;
export const CORS_ORIGIN3 = process.env.CORS_ORIGIN3;
export const CORS_ORIGIN4 = process.env.CORS_ORIGIN4;
export const CORS_ORIGIN5 = process.env.CORS_ORIGIN5;
export const CORS_ORIGIN6 = process.env.CORS_ORIGIN6;

// Rate Limiting
export const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
export const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

// Code Execution
export const CODE_EXECUTION_TIMEOUT = parseInt(process.env.CODE_EXECUTION_TIMEOUT || '10000', 10);
export const MAX_CODE_LENGTH = parseInt(process.env.MAX_CODE_LENGTH || '50000', 10);

// API Keys
export const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Get all CORS origins
export function getAllCorsOrigins(): string[] {
    const origins = [
        CORS_ORIGIN,
        CORS_ORIGIN1,
        CORS_ORIGIN2,
        CORS_ORIGIN3,
        CORS_ORIGIN4,
        CORS_ORIGIN5,
        CORS_ORIGIN6
    ].filter(Boolean) as string[];
    
    return origins;
}
