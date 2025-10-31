export class RequestError extends Error {
    code: number;
    statusCode: number;
    
    constructor(message: string, code: number, statusCode: number) {
        super(message);
        this.name = 'RequestError';
        this.code = code;
        this.statusCode = statusCode;
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError);
        }
    }
}

/*
HTTP Status Codes Reference:
200 OK - Response to a successful GET, PUT, PATCH or DELETE
201 Created - Response to a POST that results in a creation
204 No Content - Response to a successful request that won't be returning a body
304 Not Modified - Used when HTTP caching headers are in play
400 Bad Request - The request is malformed, such as if the body does not parse
401 Unauthorized - When no or invalid authentication details are provided
403 Forbidden - When authentication succeeded but authenticated user doesn't have access to the resource
404 Not Found - When a non-existent resource is requested
405 Method Not Allowed - When an HTTP method is being requested that isn't allowed for the authenticated user
410 Gone - Indicates that the resource at this end point is no longer available
415 Unsupported Media Type - If incorrect content type was provided as part of the request
422 Unprocessable Entity - Used for validation errors
429 Too Many Requests - When a request is rejected due to rate limiting
500 Internal Server Error - This is either a system or application error
503 Service Unavailable - The server is unable to handle the request for a service due to temporary maintenance
*/

/*
Error Code Convention:
- 1xxxx: Common/General errors
- 2xxxx: Authentication & Authorization errors  
- 3xxxx: Room management errors
- 4xxxx: Code execution errors
- 5xxxx: User management errors
- 6xxxx: Message/Chat errors
*/

export const ERRORS = {
    // Common Errors (1xxxx)
    DATABASE_ERROR: new RequestError("Database operation failed", 10001, 500),
    INVALID_REQUEST_BODY: new RequestError("Invalid request body", 10002, 400),
    INVALID_QUERY_PARAMETER: new RequestError("Invalid query parameters", 10003, 400),
    UNHANDLED_ERROR: new RequestError("An unexpected error occurred", 10004, 500),
    INTERNAL_SERVER_ERROR: new RequestError("Internal server error", 10005, 500),
    FILE_NOT_FOUND: new RequestError("File not found", 10006, 404),
    INVALID_PARAMS: new RequestError("Invalid parameters", 10007, 400),
    VALIDATION_ERROR: new RequestError("Validation failed", 10008, 422),
    RESOURCE_NOT_FOUND: new RequestError("Resource not found", 10009, 404),
    DUPLICATE_RESOURCE: new RequestError("Resource already exists", 10010, 409),
    RESOURCE_ALREADY_EXISTS: new RequestError("Resource already exists", 10010, 409),
    RESOURCE_IN_USE: new RequestError("Resource is in use and cannot be deleted", 10011, 400),
    
    // Authentication & Authorization Errors (2xxxx)
    NO_TOKEN_PROVIDED: new RequestError("No authentication token provided", 20001, 401),
    NO_AUTH_TOKEN: new RequestError("No authentication token provided", 20001, 401),
    INVALID_AUTH_TOKEN: new RequestError("Invalid authentication token", 20002, 401),
    TOKEN_EXPIRED: new RequestError("Authentication token has expired", 20003, 401),
    INVALID_REFRESH_TOKEN: new RequestError("Invalid refresh token", 20004, 401),
    UNAUTHORIZED: new RequestError("Unauthorized access", 20005, 401),
    FORBIDDEN: new RequestError("Access forbidden", 20006, 403),
    JWT_SECRET_NOT_CONFIGURED: new RequestError("JWT secret not configured", 20007, 500),
    
    // Room Management Errors (3xxxx)
    ROOM_NOT_FOUND: new RequestError("Room not found", 30001, 404),
    ROOM_FULL: new RequestError("Room is full", 30002, 400),
    INVALID_ROOM_ID: new RequestError("Invalid room ID", 30003, 400),
    USER_NOT_IN_ROOM: new RequestError("User not in room", 30004, 400),
    ALREADY_IN_ROOM: new RequestError("User already in room", 30005, 400),
    
    // Code Execution Errors (4xxxx)
    CODE_EXECUTION_FAILED: new RequestError("Code execution failed", 40001, 500),
    CODE_TIMEOUT: new RequestError("Code execution timeout", 40002, 408),
    INVALID_LANGUAGE: new RequestError("Invalid programming language", 40003, 400),
    CODE_TOO_LARGE: new RequestError("Code exceeds maximum length", 40004, 400),
    COMPILATION_ERROR: new RequestError("Code compilation error", 40005, 400),
    COMPILER_SERVICE_UNAVAILABLE: new RequestError("Code compilation service unavailable", 40006, 503),
    COMPILER_API_ERROR: new RequestError("Code compilation API error", 40007, 500),
    
    // AI Service Errors (7xxxx)
    AI_SERVICE_UNAVAILABLE: new RequestError("AI service unavailable", 70001, 503),
    AI_API_ERROR: new RequestError("AI API error", 70002, 500),
    AI_REQUEST_TOO_LARGE: new RequestError("AI request too large", 70003, 400),
    AI_INVALID_CONTEXT: new RequestError("Invalid AI context", 70004, 400),
    AI_RATE_LIMIT_EXCEEDED: new RequestError("AI rate limit exceeded", 70005, 429),
    
    // User Management Errors (5xxxx)
    USER_NOT_FOUND: new RequestError("User not found", 50001, 404),
    USERNAME_ALREADY_EXISTS: new RequestError("Username already exists", 50002, 409),
    EMAIL_ALREADY_EXISTS: new RequestError("Email already exists", 50003, 409),
    INVALID_CREDENTIALS: new RequestError("Invalid username or password", 50004, 401),
    INVALID_USERNAME_FORMAT: new RequestError("Invalid username format", 50005, 400),
    INVALID_EMAIL_FORMAT: new RequestError("Invalid email format", 50006, 400),
    INVALID_PASSWORD_FORMAT: new RequestError("Password must be at least 8 characters", 50007, 400),
    
    // Message/Chat Errors (6xxxx)
    MESSAGE_TOO_LONG: new RequestError("Message exceeds maximum length", 60001, 400),
    INVALID_MESSAGE_FORMAT: new RequestError("Invalid message format", 60002, 400),
    MESSAGE_NOT_FOUND: new RequestError("Message not found", 60003, 404),
} as const;

// Helper function to check if error is a RequestError
export function isRequestError(error: any): error is RequestError {
    return error instanceof RequestError;
}
