export const ACTIONS = {
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
  WHITEBOARD_SYNC_REQUEST: 'whiteboard-sync-request'
} as const;