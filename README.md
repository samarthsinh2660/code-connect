# Code Connect 🚀

A modern, real-time collaborative code editor platform that enables developers to code together seamlessly with advanced features like live editing, chat, whiteboard, AI assistance, and immersive UI effects.

![Code Connect](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue.svg)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7.5-black.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

## ✨ Features

### Core Collaboration Features
- **🔄 Real-time Code Synchronization** - Live code editing across multiple users
- **💬 Real-time Chat** - Instant messaging with emoji support and typing indicators
- **🎨 Interactive Whiteboard** - Collaborative drawing with multiple tools and real-time sync
- **🤖 AI Assistant** - Context-aware AI chat powered by Google Gemini 2.0 Flash
- **⚡ Code Execution** - Run and test code in 13+ languages with sandboxed execution
- **🧠 Smart Context** - @mycode mentions for AI to reference current code

### Advanced UI/UX
- **🎭 Fluid Cursor Effects** - WebGL-based fluid simulation for immersive interactions
- **🎨 Dual Editors** - Monaco Editor (VS Code-like) and CodeMirror support
- **🌙 Dark/Light Themes** - Automatic theme switching with system preference detection
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **✨ Smooth Animations** - Powered by Framer Motion and GSAP

### Technical Features
- **🔐 Hybrid Authentication** - Choose between Email/Password or OAuth (Google/GitHub)
- **🏠 Room Management** - Multiple isolated collaboration rooms
- **📊 Performance Optimized** - Advanced caching, memoization, and lazy loading
- **🛡️ Security First** - Rate limiting, input validation, and error handling
- **📈 Scalable Architecture** - Built for production deployment

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React hooks + Context providers
- **Real-time**: Socket.IO client
- **Auth**: Clerk (OAuth) + Custom JWT

### Backend (Node.js + TypeScript)
- **Server**: Express.js + Socket.IO
- **Database**: MongoDB with Mongoose
- **Auth**: JWT tokens + bcrypt hashing
- **Security**: Rate limiting + CORS protection
- **Logging**: Winston structured logging

### Communication Flow
```
User Action → Component → Socket Emit → Server → Broadcast → Client Update → UI Render
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm/yarn/pnpm

### 1. Clone & Setup
```bash
# Clone the repository
git clone <repository-url>
cd code-connect

# Install frontend dependencies
npm install

# Setup backend
cd code-connect-backend
npm install
cp .env.example .env
```

### 2. Configure Environment

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-mongodb-atlas-connection
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000

# Code Compilation (NEW)
JUDGE0_API_KEY=your_rapidapi_key_here

# AI Service (NEW)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Services

#### Terminal 1: Backend
```bash
cd code-connect-backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd code-connect-live-main
npm run dev
```

### 4. Open Browser
- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/health

## 🔐 Authentication

Code Connect offers **two authentication methods**:

### Option 1: Email & Password (Custom)
- Register with username, email, password
- Secure JWT token authentication
- Full control over user data
- No external dependencies

### Option 2: OAuth (Clerk)
- Sign in with Google, GitHub, or other providers
- Managed authentication service
- Social login features
- Enterprise-ready security

### Choosing Authentication
1. **Visit the sign-up page**: http://localhost:3000/sign-up
2. **Toggle between methods** using the buttons at the top
3. **Choose based on your needs**:
   - Email/Password: Traditional signup flow
   - OAuth: Quick social login

## 🎯 How to Use

### 1. Authentication
- Sign up or sign in using your preferred method
- Access is granted to the collaborative editor

### 2. Create/Join a Room
- Rooms are identified by unique URLs: `/editor/[roomId]`
- Share room URLs to collaborate with others
- Each room maintains isolated code, chat, and whiteboard sessions

### 3. Real-time Collaboration
- **Code Editor**: Changes sync instantly across all users
- **Chat**: Send messages and see typing indicators
- **Whiteboard**: Draw collaboratively with various tools
- **AI Assistant**: Get coding help and suggestions

### 4. Code Execution
- Select from 13+ supported programming languages (JavaScript, Python, Java, C++, C, Go, Rust, etc.)
- Click "Run Code" to execute and see live output in a dedicated console panel
- Sandboxed execution ensures safe code running without affecting your system

### 5. AI Assistant
- **Context-Aware Help**: AI understands your current code and project context
- **Smart Mentions**: Use `@mycode` in your messages to reference your current code
- **Multiple Features**: Code explanations, suggestions, error fixing, and more
- **Powered by Gemini 2.0 Flash**: Advanced AI model for accurate coding assistance

### 6. Whiteboard Collaboration
- **Real-time Sync**: Drawing actions sync instantly across all users
- **Multiple Tools**: Pen, eraser, shapes, text, and image insertion
- **Persistent State**: Whiteboard content persists for room participants

## 📡 API Overview

### REST Endpoints
```bash
GET  /api/status          # API information
GET  /health              # Health check
POST /api/auth/register   # User registration
POST /api/auth/login      # User login
GET  /api/auth/me         # Get current user
POST /api/auth/logout     # Logout
GET  /api/rooms           # List active rooms
POST /api/rooms           # Create room
GET  /api/rooms/:id       # Get room details
PUT  /api/rooms/:id/code  # Update room code

# Code Compilation & AI (NEW)
POST /api/compiler/compile     # Execute code in multiple languages
GET  /api/compiler/languages   # Get supported programming languages
POST /api/ai/chat             # Chat with AI assistant
POST /api/ai/explain          # Get code explanations
POST /api/ai/suggestions      # Get code improvement suggestions
POST /api/ai/fix              # Fix code errors with AI
```

### Socket.IO Events
```javascript
// Join/Leave
socket.emit('join', { id: roomId, user: username });
socket.emit('leave', { roomId });

// Code Sync
socket.emit('code-change', { roomId, code });
socket.on('code-change', ({ code }) => { /* update editor */ });

// Chat
socket.emit('send-message', { roomId, username, message });
socket.on('receive-message', (message) => { /* display message */ });

// Code Execution
socket.emit('compile', { roomId, code, language });
socket.on('compile-result', ({ result, error }) => { /* show output */ });

// Whiteboard (NEW)
socket.emit('whiteboard-draw', { roomId, action });
socket.emit('whiteboard-clear', { roomId });
socket.emit('whiteboard-sync-request', { roomId });
socket.on('whiteboard-draw', ({ action }) => { /* draw action */ });
socket.on('whiteboard-clear', () => { /* clear whiteboard */ });
socket.on('whiteboard-sync', ({ actions }) => { /* load whiteboard state */ });
```

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

#### Backend
```bash
npm run dev      # Development with tsx watch
npm run build    # TypeScript compilation
npm start        # Production server
```

### Project Structure
```
code-connect/
├── code-connect-live-main/     # Frontend (Next.js)
│   ├── src/app/               # Next.js app directory
│   ├── src/components/        # React components
│   ├── src/providers/         # Context providers
│   └── public/                # Static assets
├── code-connect-backend/      # Backend (Express + Socket.IO)
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── utils/            # Utilities
│   └── .env.example          # Environment template
└── README.md                  # This file
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend (Railway)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add --plugin mongodb
railway up
```

### Environment Variables for Production
```env
# Frontend
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://production-connection
JWT_SECRET=super-secure-production-key
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🔧 Configuration

### MongoDB Setup
1. **Atlas (Recommended)**: Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. **Local**: Install MongoDB and run `mongod`
3. Update `MONGODB_URI` in backend `.env`

### Clerk Setup
1. Create app at [Clerk Dashboard](https://dashboard.clerk.dev)
2. Get publishable and secret keys
3. Configure OAuth providers (Google, GitHub)
4. Update frontend `.env.local`

### Socket.IO Configuration
- CORS origins configured in backend
- Connection limits and timeouts set
- Automatic reconnection enabled

## 🐛 Troubleshooting

### Common Issues

**"Cannot find package 'uuid'"**
```bash
cd code-connect-backend
npm install
```

**"MongoDB connection failed"**
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running (local) or accessible (Atlas)
- Verify network connectivity

**"Socket.IO connection failed"**
- Check backend is running on port 5000
- Verify `NEXT_PUBLIC_SOCKET_URL` points to correct backend URL
- Check CORS configuration

**"Authentication not working"**
- Verify Clerk keys in frontend `.env.local`
- Check JWT secret in backend `.env`
- Ensure MongoDB connection for user storage

**Hydration errors**
```bash
# Clear Next.js cache
cd code-connect-live-main
rm -rf .next
npm run dev
```

### Development Tips
- Use browser developer tools to inspect Socket.IO connections
- Check server logs for detailed error messages
- Use MongoDB Compass to inspect database state
- Enable Clerk debug mode for auth troubleshooting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing code style and patterns
- Add proper error handling
- Test real-time features thoroughly
- Update documentation for new features

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Socket.IO** - Real-time communication made easy
- **MongoDB** - Flexible document database
- **Clerk** - Authentication simplified
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **Monaco Editor** - VS Code editing experience

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@codeconnect.dev

---

**Built with ❤️ for collaborative coding. Happy hacking! 🚀**

> *"Code together, learn together, build together."*
