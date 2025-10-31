import { config } from "dotenv";

// Load environment variables
config();
interface Env {
  // Server Configuration
  NODE_ENV: string;
  PORT: string;
  SERVER_URL: string;

  // Database Configuration
  MONGODB_URI: string;
  DB_NAME: string;

  // JWT Configuration
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  // CORS Configuration
  CORS_ORIGIN: string;
  CORS_ORIGIN1?: string;
  CORS_ORIGIN2?: string;
  CORS_ORIGIN3?: string;
  CORS_ORIGIN4?: string;
  CORS_ORIGIN5?: string;
  CORS_ORIGIN6?: string;

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;

  // Code Execution
  CODE_EXECUTION_TIMEOUT: number;
  MAX_CODE_LENGTH: number;

  // API Keys
  JUDGE0_API_KEY?: string;
  GEMINI_API_KEY?: string;
}

const env: Env = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/code-connect',
  DB_NAME: process.env.DB_NAME || 'code_connect',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CORS_ORIGIN1: process.env.CORS_ORIGIN1,
  CORS_ORIGIN2: process.env.CORS_ORIGIN2,
  CORS_ORIGIN3: process.env.CORS_ORIGIN3,
  CORS_ORIGIN4: process.env.CORS_ORIGIN4,
  CORS_ORIGIN5: process.env.CORS_ORIGIN5,
  CORS_ORIGIN6: process.env.CORS_ORIGIN6,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Code Execution
  CODE_EXECUTION_TIMEOUT: parseInt(process.env.CODE_EXECUTION_TIMEOUT || '10000', 10),
  MAX_CODE_LENGTH: parseInt(process.env.MAX_CODE_LENGTH || '50000', 10),

  // API Keys
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

// Export individual properties for backward compatibility
export const {
  NODE_ENV,
  PORT,
  SERVER_URL,
  MONGODB_URI,
  DB_NAME,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  CORS_ORIGIN,
  CORS_ORIGIN1,
  CORS_ORIGIN2,
  CORS_ORIGIN3,
  CORS_ORIGIN4,
  CORS_ORIGIN5,
  CORS_ORIGIN6,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  CODE_EXECUTION_TIMEOUT,
  MAX_CODE_LENGTH,
  JUDGE0_API_KEY,
  GEMINI_API_KEY,
} = env;

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
