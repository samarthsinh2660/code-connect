# 🌐 WebSocket Implementation Documentation

## Table of Contents
- [WebSocket Architecture](#websocket-architecture)
  - [Socket.IO Client Setup](#socketio-client-setup)
  - [Connection Management](#connection-management)
  - [Room-Based Communication](#room-based-communication)
  - [Real-time Event Flow](#real-time-event-flow)
- [Complex System Components](#complex-system-components)
  - [1. Fluid Cursor System](#1-fluid-cursor-system-usef-fluidcursorts)
  - [2. AI Assistant Integration](#2-ai-assistant-integration-aiassistanttsx)
  - [3. Collaborative Whiteboard](#3-collaborative-whiteboard-whiteboardtsx)
  - [4. Real-time Chat System](#4-real-time-chat-system-chattsx)
  - [5. Code Editor Integration](#5-code-editor-integration-monaco-editor)
  - [6. Code Execution System](#6-code-execution-system)
  - [7. Authentication & User Management](#7-authentication--user-management)
  - [8. Responsive Layout & UI System](#8-responsive-layout--ui-system)
  - [9. Performance Optimizations](#9-performance-optimizations)
  - [10. Error Handling & Resilience](#10-error-handling--resilience)
- [Data Flow Architecture](#data-flow-architecture)
- [Backend Architecture](#backend-architecture)
  - [Backend Server Location](#backend-server-location)
  - [Code Compilation Flow](#code-compilation-flow)
- [Whiteboard Implementation](#whiteboard-implementation)
  - [Core Architecture](#core-architecture)
  - [Drawing Tools & How They Work](#drawing-tools--how-they-work)
  - [Real-time Collaboration](#real-time-collaboration)
  - [Canvas Management](#canvas-management)
- [AI Assistant Implementation](#ai-assistant-implementation)
  - [AI Integration Architecture](#ai-integration-architecture)
  - [Message Processing Pipeline](#message-processing-pipeline)
  - [Advanced Features](#advanced-features)
  - [API Security](#api-security)

---

## WebSocket Architecture

### Socket.IO Client Setup
The WebSocket functionality uses Socket.IO client connecting to an external server at https://code-connect-server-production.up.railway.app. Here's how it works:

#### 1. Connection Establishment (`socketProvider.tsx`)
Uses `io()` from `socket.io-client` to create a connection
Configured with:
- `forceNew: true` - Forces a new connection
- `reconnectionAttempts: 5` - Retries up to 5 times on failure
- `timeout: 10000` - 10-second timeout
- `transports: ['websocket']` - Uses WebSocket transport
- `auth: { username }` - Passes username for authentication

#### 2. Connection Management
- Event Listeners: `connect`, `connect_error`, `disconnect`, `error`
- Cleanup: Removes listeners and disconnects on component unmount
- User Context: Uses React Context to provide socket instance to all components

#### 3. Room-Based Communication
- Rooms are identified by unique IDs in URL paths (`/editor/[roomId]`)
- Users join rooms with `socket.emit(ACTIONS.JOIN, { id: roomId, user: username })`
- Server broadcasts events to all users in the same room

### Real-time Event Flow

#### Code Synchronization:
```typescript
// When code changes
socket.emit(ACTIONS.CODE_CHANGE, { roomId, code: value })

// Server broadcasts to all room members
socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
  setCode(code)
})
```

#### User Presence:
```typescript
socket.on(ACTIONS.JOINED, ({ clients, user, socketId }) => {
  setClients(clients)  // Update user list
  toast.success(`${user} joined the room`)
})
```

---

## Complex System Components

### 1. Fluid Cursor System (`use-FluidCursor.ts`)
**What it does:** Creates WebGL-based fluid simulation for cursor interactions, generating particle effects that follow mouse movement.

**How it works:**
- WebGL Context: Creates canvas with WebGL2/WebGL1 fallback
- Fluid Simulation: Uses computational fluid dynamics with:
  - Velocity Field: Tracks fluid movement vectors
  - Density Field: Stores color/particle density
  - Pressure Solver: Uses Jacobi iteration for incompressible flow
  - Shaders: Custom GLSL shaders for:
    - Advection: Moves particles with fluid flow
    - Diffusion: Spreads particles over time
    - Vorticity: Adds rotational forces for swirls
    - Pressure Projection: Makes fluid incompressible

**Key Features:**
- Color Generation: Random neon colors (cyan/teal variations)
- Mouse Tracking: Converts mouse coordinates to texture coordinates
- Click Effects: Creates bright cyan flashes on mouse clicks
- Performance: Uses multiple framebuffers for ping-pong rendering

### 2. AI Assistant Integration (`AiAssistant.tsx`)
**What it does:** Provides real-time AI chat for coding assistance using Google Gemini AI.

**How it works:**
- Dual AI Providers:
  - Google Gemini 2.0 Flash: Primary AI for code assistance
  - OpenRouter API: Alternative with OpenAI models
- Message Processing:
  - Markdown Parsing: Converts AI responses with code blocks, bold, italic
  - Syntax Highlighting: Custom `CodeBlock` component with copy functionality
  - Streaming: Real-time response display with typing animations

**Technical Implementation:**
```typescript
const genAI = new GoogleGenerativeAI("API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent(prompt);
```

### 3. Collaborative Whiteboard (`WhiteBoard.tsx`)
**What it does:** Real-time collaborative drawing canvas with multiple tools.

**How it works:**
- Canvas Rendering: HTML5 Canvas with 2D context
- Drawing Actions: Structured data format for all drawing operations:

```typescript
type DrawingAction = {
  tool: 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text' | 'image';
  paths: { x: number; y: number; pressure?: number }[];
  color: string;
  width: number;
}
```

**Tools Implementation:**
- Pen/Eraser: Stroke-based drawing with pressure sensitivity
- Shapes: Drag-to-create rectangles, circles, lines
- Text: Click-to-place text input
- Images: File upload and placement
- Real-time Sync: (Note: Current implementation is local-only, would need WebSocket integration for collaboration)

### 4. Real-time Chat System (`Chat.tsx`)
**What it does:** Instant messaging with typing indicators and message history.

**How it works:**
- Message Synchronization:
  - `SYNC_MESSAGES`: Loads message history on join
  - `RECEIVE_MESSAGE`: Real-time message delivery
  - `SEND_MESSAGE`: Broadcasts user messages

**Advanced Features:**
- Typing Indicators: Debounced typing events with 1.5s timeout
- Message Normalization: Converts usernames to lowercase for consistency
- Auto-scroll: Smooth scrolling to latest messages
- Character Limits: 1000-character limit with visual progress indicator

**UI Animations:**
- Framer Motion: Entrance/exit animations for messages
- Particle Effects: Animated dots for typing indicator
- Glass Morphism: Backdrop blur effects on chat panel

### 5. Code Editor Integration (monaco-editor)
**What it does:** Dual editor system with Monaco Editor (VS Code) and CodeMirror.

**How it works:**
- Monaco Editor:
  - Full VS Code-like experience
  - Syntax highlighting, IntelliSense, themes
  - Configurable font size, language selection
- CodeMirror: Alternative lightweight editor

**Real-time Features:**
- Live Sync: Code changes broadcast via `CODE_CHANGE` events
- Typing Indicators: Shows which users are actively typing
- Cursor Positions: (Could be extended to show other users' cursors)

### 6. Code Execution System
**What it does:** Runs code snippets and displays output in real-time.

**How it works:**
- Server-side Execution: Code sent to backend via `COMPILE` event
- Multi-language Support: JavaScript, Python, Java, C++
- Output Handling:
  - Success: `COMPILE_RESULT` with output
  - Error: Error messages displayed in console
- Console UI: Dedicated panel with output history, clear functionality

### 7. Authentication & User Management
**What it does:** Handles user authentication and session management.

**How it works:**
- Clerk Integration:
  - Social login (Google, GitHub, etc.)
  - User profiles and session management
  - Protected routes and middleware

**Flow:**
- Landing Page: Auth modal appears for unauthenticated users
- Post-Auth: Redirects to editor with username parameter
- Room Access: Authenticated users can join collaborative sessions

### 8. Responsive Layout & UI System
**What it does:** Complex responsive layout with multiple panels and animations.

**Key Components:**
- Panel Management: Sidebar, chat, whiteboard, AI assistant panels
- Responsive Design: Adapts to different screen sizes
- Animation System:
  - Framer Motion: Page transitions, hover effects
  - GSAP: Advanced animations (potential future use)
  - Tailwind CSS: Utility-first styling with shadcn/ui components

### 9. Performance Optimizations
**What it does:** Ensures smooth performance across complex features.

**Techniques:**
- Dynamic Imports: Code splitting for large components
- Memoization: `useMemo` for expensive calculations
- Debouncing: Typing indicators, scroll events
- Canvas Optimization: Efficient WebGL rendering with framebuffers
- Lazy Loading: Components loaded on demand

### 10. Error Handling & Resilience
**What it does:** Manages connection issues and errors gracefully.

**Features:**
- Reconnection Logic: Automatic reconnection with exponential backoff
- Error Boundaries: React error boundaries for component failures
- Fallback UI: Loading states, error messages, retry mechanisms
- Connection Status: Visual indicators for connection state

---

## Data Flow Architecture
```
User Action → Component Event → Socket Emit → Server → Broadcast → Client Update → UI Re-render
```

**Example Flow:**
- User types in editor → `handleCodeChange` → `socket.emit(CODE_CHANGE)`
- Server receives → broadcasts to room → other clients `socket.on(CODE_CHANGE)`
- UI updates with new code → smooth animation transition

This architecture enables real-time collaboration while maintaining performance and providing a polished user experience through advanced animations and visual effects.

---

## Backend Architecture

### Backend Server Location
The backend is not in this repository - it's a separate Node.js Socket.IO server deployed on Railway at:

https://code-connect-server-production.up.railway.app

### Code Compilation Flow
When you click "Run Code", this happens:

#### 1. Frontend Code Execution (`handleRunCode` function):
```typescript
const handleRunCode = () => {
  try {
    socket?.emit(ACTIONS.COMPILE, { roomId, code, language })
  } catch (err: any) {
    setOutput(`Error: ${err.message}`)
  }
}
```

#### 2. Data Sent to Backend:
- `roomId`: Unique room identifier
- `code`: The code from the editor
- `language`: Selected programming language (JavaScript, Python, Java, C++)

#### 3. Backend Processing:
The external server receives `ACTIONS.COMPILE` event and:
- Executes the code in a sandboxed environment
- Handles multiple programming languages
- Returns results via `COMPILE_RESULT` event

#### 4. Frontend Response Handling:
```typescript
socket.on(ACTIONS.COMPILE_RESULT, ({ result, error }) => {
  if (error) {
    setOutput(error)
    setConsoleOutput((prev) => [...prev, { type: "error", content: error }])
  } else {
    setOutput(result)
    setConsoleOutput((prev) => [...prev, { type: "log", content: result }])
  }
})
```

---

## Whiteboard Implementation
The whiteboard uses HTML5 Canvas with 2D rendering context and implements multiple drawing tools:

### Core Architecture
```typescript
interface DrawingAction {
  tool: 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text' | 'image';
  paths: { x: number; y: number; pressure?: number }[];
  color: string;
  width: number;
  text?: string;
  image?: string;
  x?: number;
  y?: number;
  width2?: number;
  height?: number;
}
```

### Drawing Tools & How They Work

#### 1. Pen Tool:
- Mouse Events: Tracks `mousedown` → `mousemove` → `mouseup`
- Path Recording: Stores every point in `paths` array with coordinates
- Rendering: Connects points with smooth lines using `context.lineTo()`
- Pressure Support: Uses `pointer.pressure` for varying line thickness

#### 2. Eraser Tool:
- Same as Pen but: Draws white lines (`strokeStyle = '#ffffff'`) to "erase"
- Width: Usually larger than pen for better erasing

#### 3. Shape Tools (Rectangle, Circle, Line):
- Drag-to-Create: Records start and end points
- Calculation:
  - Rectangle: `width = endX - startX`, `height = endY - startY`
  - Circle: `radius = sqrt((endX-startX)² + (endY-startY)²)`
- Rendering: Uses `context.rect()`, `context.arc()` functions

#### 4. Text Tool:
- Click-to-Place: Shows text input at clicked position
- Font Rendering: `context.font = ${width * 5}px sans-serif`
- Positioning: Uses stored `x, y` coordinates

#### 5. Image Tool:
- File Upload: Accepts image files via `<input type="file">`
- Placement: Click to position, drag to resize
- Rendering: `context.drawImage(img, x, y, width, height)`

### Real-time Collaboration
**Current Status:** The whiteboard is local-only in the current implementation. To make it collaborative, it would need:
- WebSocket events for drawing actions
- Broadcasting drawing data to all room members
- Receiving and applying other users' drawings

### Canvas Management
- Resize Handling: Automatically adjusts canvas size on window resize
- Undo/Redo: Maintains action history in `actions` and `redoStack` arrays
- Performance: Uses `requestAnimationFrame` for smooth rendering

---

## AI Assistant Implementation
The AI assistant integrates Google Gemini AI with OpenRouter API fallback:

### AI Integration Architecture

#### 1. Primary AI: Google Gemini
```typescript
const genAI = new GoogleGenerativeAI("AIzaSyCF6mKRofVaWa-4RC6hjYQtijNqxOZSt58");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const result = await model.generateContent(prompt);
```

#### 2. Fallback AI: OpenRouter
```typescript
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "sk-or-v1-...",
});
```

### Message Processing Pipeline

#### 1. User Input:
- Character Limit: 1000 characters with visual progress indicator
- Real-time Validation: Prevents empty submissions

#### 2. AI Processing:
- Prompt Enhancement: Adds context about coding assistance
- Streaming Response: Real-time text generation
- Error Handling: Graceful fallbacks with retry logic

#### 3. Response Formatting:
```typescript
const formatMessage = (content: string): MessagePart[] => {
  // Handles markdown parsing:
  // - Code blocks: ```language\ncode\n```
  // - Bold: **text**
  // - Italic: *text*
  // - Lists: - item or • item
}
```

#### 4. UI Rendering:
- Code Blocks: Syntax-highlighted with copy buttons
- Rich Text: HTML rendering for formatting
- Animations: Smooth message appearance with Framer Motion

### Advanced Features

#### 1. Typing Indicators:
- Debounced Events: 800ms delay before showing "typing..."
- Real-time Sync: Broadcasts typing status to other users

#### 2. Message History:
- Persistent Storage: Messages saved during session
- Auto-scroll: Smooth scrolling to latest messages
- Normalization: Consistent username formatting

#### 3. UI Polish:
- Glass Morphism: Backdrop blur effects
- Particle Effects: Animated dots for typing indicator
- 3D Interactions: Hover effects with parallax

### API Security
- Client-side Keys: API keys are embedded (not recommended for production)
- Request Limits: Managed through OpenRouter quotas
- Error Recovery: Automatic fallback between AI providers

The system provides a seamless AI coding assistant experience while maintaining real-time collaboration features through the existing chat infrastructure.