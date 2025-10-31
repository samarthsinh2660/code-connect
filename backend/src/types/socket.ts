export interface Client {
    socketId: string;
    username: string;
}

export interface RoomData {
    roomId: string;
    clients: Client[];
    code: string;
    language: string;
    messages: Message[];
    createdAt: Date;
    lastActivity: Date;
}

export interface Message {
    id: string;
    username: string;
    content: string;
    timestamp: Date;
    roomId: string;
}

export interface JoinPayload {
    id: string;
    user: string;
}

export interface LeavePayload {
    roomId: string;
}

export interface CodeChangePayload {
    roomId: string;
    code: string;
}

export interface CompilePayload {
    roomId: string;
    code: string;
    language: string;
}

export interface TypingPayload {
    roomId: string;
    username: string;
}

export interface SendMessagePayload {
    roomId: string;
    username: string;
    message: string;
}

export const SOCKET_ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    LEAVE: 'leave',
    COMPILE: 'compile',
    COMPILE_RESULT: 'compile-result',
    TYPING: 'typing',
    STOP_TYPING: 'stop-typing',
    SEND_MESSAGE: 'send-message',
    RECEIVE_MESSAGE: 'receive-message',
    SYNC_MESSAGES: 'sync-messages',
    WHITEBOARD_DRAW: 'whiteboard-draw',
    WHITEBOARD_CLEAR: 'whiteboard-clear',
    WHITEBOARD_SYNC: 'whiteboard-sync',
    WHITEBOARD_SYNC_REQUEST: 'whiteboard-sync-request',
    ERROR: 'error'
} as const;
