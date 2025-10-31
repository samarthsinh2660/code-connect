# Code Connect Backend

Backend server for Code Connect - A real-time collaborative code editor platform with Socket.IO support.

## 🚀 Features

- **Real-time Collaboration**: Socket.IO-based WebSocket server for live code synchronization
- **Room Management**: Multiple rooms with isolated code sessions
- **Chat System**: Real-time messaging within rooms
- **Code Execution**: Multi-language code compilation with Judge0 API (13+ languages)
- **AI Assistant**: Context-aware AI chat powered by Google Gemini 2.0 Flash
- **Whiteboard Sync**: Real-time collaborative drawing synchronization
- **Typing Indicators**: Live typing status for collaborative editing
- **MongoDB Integration**: Persistent storage for rooms, messages, and user data
- **Rate Limiting**: Protection against abuse with configurable limits
- **Error Handling**: Comprehensive error handling with custom error codes
- **Logging**: Structured logging with Winston
- **TypeScript**: Full TypeScript support for type safety

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm, yarn, pnpm, or bun

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   cd code-connect-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

   **Note**: Make sure to install the new dependencies for AI and code compilation:
   ```bash
   npm install axios @google/generative-ai
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   SERVER_URL=http://localhost:5000

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/code-connect
   DB_NAME=code_connect

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   CORS_ORIGIN1=http://localhost:3001

   # Code Compilation (NEW)
   JUDGE0_API_KEY=your_rapidapi_key_here

   # AI Service (NEW)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📡 API Endpoints

### HTTP Endpoints

- `GET /` - API information
- `GET /health` - Health check endpoint
- `GET /api/status` - API status and configuration
- `POST /api/compiler/compile` - Execute code in multiple programming languages (NEW)
- `GET /api/compiler/languages` - Get list of supported programming languages (NEW)
- `POST /api/ai/chat` - Chat with AI assistant (NEW)
- `POST /api/ai/explain` - Get AI-powered code explanations (NEW)
- `POST /api/ai/suggestions` - Get code improvement suggestions (NEW)
- `POST /api/ai/fix` - Fix code errors with AI assistance (NEW)

### Socket.IO Events

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ id: roomId, user: username }` | Join a room |
| `leave` | `{ roomId }` | Leave a room |
| `code-change` | `{ roomId, code }` | Broadcast code changes |
| `compile` | `{ roomId, code, language }` | Execute code |
| `typing` | `{ roomId, username }` | User is typing |
| `stop-typing` | `{ roomId, username }` | User stopped typing |
| `send-message` | `{ roomId, username, message }` | Send chat message |
| `whiteboard-draw` | `{ roomId, action }` | Draw on whiteboard (NEW) |
| `whiteboard-clear` | `{ roomId }` | Clear whiteboard (NEW) |
| `whiteboard-sync-request` | `{ roomId }` | Request whiteboard sync (NEW) |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `joined` | `{ clients, user, socketId }` | User joined room |
| `disconnected` | `{ socketId, user, clients }` | User left room |
| `code-change` | `{ code }` | Code updated |
| `sync-code` | `{ code }` | Sync code to new user |
| `sync-messages` | `{ messages }` | Sync messages to new user |
| `compile-result` | `{ result?, error? }` | Code execution result |
| `typing` | `{ username }` | User is typing |
| `stop-typing` | `{ username }` | User stopped typing |
| `receive-message` | `{ id, username, content, timestamp }` | New message |
| `whiteboard-draw` | `{ action }` | Whiteboard drawing action (NEW) |
| `whiteboard-clear` | `` | Whiteboard cleared (NEW) |
| `whiteboard-sync` | `{ actions }` | Whiteboard state sync (NEW) |
| `error` | `{ message }` | Error occurred |

## 🗂️ Project Structure

```
code-connect-backend/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment configuration
│   ├── database/
│   │   └── connection.ts       # MongoDB connection
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling middleware
│   │   └── rateLimiter.ts     # Rate limiting middleware
│   ├── models/
│   │   ├── Room.model.ts      # Room schema
│   │   └── User.model.ts      # User schema
│   ├── services/
│   │   └── socket.service.ts  # Socket.IO service
│   ├── types/
│   │   ├── express.d.ts       # Express type extensions
│   │   └── socket.ts          # Socket.IO types
│   ├── utils/
│   │   ├── error.ts           # Custom error classes
│   │   ├── jwt.ts             # JWT utilities
│   │   ├── logger.ts          # Logging utilities
│   │   └── response.ts        # Response formatters
│   └── server.ts              # Main server file
├── .env.example               # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/code-connect |
| `JWT_SECRET` | JWT signing secret | (required) |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `JUDGE0_API_KEY` | Judge0 API key for code compilation | (required for compilation) |
| `GEMINI_API_KEY` | Google Gemini API key for AI | (required for AI features) |

### Database Schema

#### Room Collection
```typescript
{
  roomId: string,
  clients: [{ socketId, username, joinedAt }],
  code: string,
  language: string,
  messages: [{ id, username, content, timestamp }],
  createdAt: Date,
  lastActivity: Date,
  isActive: boolean
}
```

## 🚀 Deployment

### Deploy to Railway

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and initialize:
   ```bash
   railway login
   railway init
   ```

3. Add MongoDB plugin:
   ```bash
   railway add --plugin mongodb
   ```

4. Deploy:
   ```bash
   railway up
   ```

### Deploy to Heroku

1. Create Heroku app:
   ```bash
   heroku create code-connect-backend
   ```

2. Add MongoDB addon:
   ```bash
   heroku addons:create mongodb:sandbox
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with configurable request limits
- **CORS Protection**: Whitelist-based origin validation
- **Input Validation**: Validates all incoming data
- **Error Handling**: Sanitized error messages in production
- **JWT Authentication**: Secure token-based auth (ready for integration)

## 🧪 Code Execution

The backend now supports **multi-language code execution** using the Judge0 API, a secure online code execution system. This provides sandboxed execution for 13+ programming languages.

### Supported Languages
- **JavaScript** (Node.js 18)
- **Python** (3.8.1)
- **Java** (OpenJDK 17)
- **C** (GCC 9.2.0)
- **C++** (GCC 9.2.0)
- **TypeScript** (4.3.5)
- **C#** (.NET 5.0)
- **Go** (1.16.2)
- **Rust** (1.49.0)
- **Ruby** (3.0.0)
- **PHP** (8.0.3)
- **Swift** (5.3.3)
- **Kotlin** (1.4.32)

### Getting API Access
1. Visit [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Sign up for a free account
3. Subscribe to the free tier (50 requests/day)
4. Copy your API key to `JUDGE0_API_KEY` environment variable

### Usage
```typescript
// Execute code
POST /api/compiler/compile
{
  "language": "python",
  "code": "print('Hello World!')",
  "input": "optional input data"
}

// Get supported languages
GET /api/compiler/languages
```

## 🤖 AI Assistant

The backend integrates **Google Gemini 2.0 Flash** for AI-powered coding assistance with context awareness.

### AI Features
- **Context-Aware Chat**: AI understands your current code and project
- **Code Explanations**: Get detailed explanations of code functionality
- **Bug Detection**: Identify potential issues and bugs
- **Code Suggestions**: Receive improvement recommendations
- **Error Fixing**: Get AI-powered solutions for code errors
- **@mycode Support**: Reference current code context in conversations

### Getting API Access
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy your API key to `GEMINI_API_KEY` environment variable

### Usage
```typescript
// Chat with AI
POST /api/ai/chat
{
  "message": "Explain @mycode",
  "context": { "code": "...", "language": "javascript" },
  "history": [...]
}

// Get code explanation
POST /api/ai/explain
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript"
}

// Get suggestions
POST /api/ai/suggestions
{
  "code": "...",
  "language": "javascript",
  "issue": "performance"
}
```

## 📊 Monitoring & Logging

- Winston logger with file and console transports
- Structured logging with context tags
- Error tracking with stack traces
- Connection status logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License

## 🔗 Related Projects

- [Code Connect Frontend](../code-connect-live-main) - Next.js frontend application

## 💡 Future Enhancements

- [ ] Redis integration for distributed room management
- [ ] Whiteboard collaboration sync
- [ ] User authentication system
- [ ] Code execution for multiple languages
- [ ] File upload/sharing
- [ ] Room permissions and access control
- [ ] Activity logging and analytics
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] API documentation with Swagger

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for collaborative coding**
