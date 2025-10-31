# Code Connect Backend - Setup Guide

## Quick Start Guide

### 1. Initial Setup

```bash
# Navigate to backend directory
cd code-connect-backend

# Install dependencies (already done)
npm install

# Create environment file
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your settings:

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

# CORS Configuration - Add your frontend URLs
CORS_ORIGIN=http://localhost:3000
CORS_ORIGIN1=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Code Execution
CODE_EXECUTION_TIMEOUT=10000
MAX_CODE_LENGTH=50000
```

### 3. MongoDB Setup

#### Option A: Local MongoDB

**Install MongoDB:**
- Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Mac: `brew install mongodb-community`
- Linux: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

**Start MongoDB:**
```bash
# Windows
mongod --dbpath C:\data\db

# Mac/Linux
mongod --dbpath /usr/local/var/mongodb
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/code_connect
   ```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

### 5. Verify Installation

Once server starts, you should see:

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║      🚀 Code Connect Backend Server Started 🚀        ║
║                                                        ║
║  Environment: development                              ║
║  Port: 5000                                            ║
║  Socket.IO: Active                                     ║
║  Database: Connected                                   ║
║                                                        ║
║  Health Check: http://localhost:5000/health           ║
║  API Status: http://localhost:5000/api/status         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### 6. Test the API

Open browser or use curl:

```bash
# Health check
curl http://localhost:5000/health

# API status
curl http://localhost:5000/api/status

# Get all rooms
curl http://localhost:5000/api/rooms

# Create a room
curl -X POST http://localhost:5000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"roomId":"test-room-123"}'
```

## Socket.IO Testing

You can test Socket.IO connection using the frontend or a Socket.IO client:

```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:5000', {
    auth: {
        username: 'TestUser'
    }
});

socket.on('connect', () => {
    console.log('Connected!');
    socket.emit('join', { id: 'test-room', user: 'TestUser' });
});

socket.on('joined', (data) => {
    console.log('Joined room:', data);
});
```

## Common Issues

### Issue: Cannot connect to MongoDB

**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify firewall settings
- For Atlas: Check network access whitelist

### Issue: Port already in use

**Solution:**
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: TypeScript compilation errors

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Project Structure

```
code-connect-backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── env.ts        # Environment variables
│   ├── controllers/      # Request handlers
│   │   ├── room.controller.ts
│   │   └── user.controller.ts
│   ├── database/         # Database connection
│   │   └── connection.ts
│   ├── middleware/       # Express middleware
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── models/          # Database models
│   │   ├── Room.model.ts
│   │   └── User.model.ts
│   ├── repositories/    # Data access layer
│   │   ├── room.repository.ts
│   │   └── user.repository.ts
│   ├── routes/          # API routes
│   │   ├── index.ts
│   │   ├── room.routes.ts
│   │   └── user.routes.ts
│   ├── services/        # Business logic
│   │   └── socket.service.ts
│   ├── types/           # TypeScript types
│   │   ├── express.d.ts
│   │   └── socket.ts
│   ├── utils/           # Utilities
│   │   ├── error.ts
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   └── response.ts
│   └── server.ts        # Main entry point
├── logs/                # Log files (auto-created)
├── .env                 # Environment variables (create this)
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run build` - Build TypeScript to JavaScript
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/status` | API status |
| GET | `/api/rooms` | Get all active rooms |
| POST | `/api/rooms` | Create a room |
| GET | `/api/rooms/:roomId` | Get room by ID |
| PUT | `/api/rooms/:roomId/code` | Update room code |
| DELETE | `/api/rooms/:roomId` | Deactivate room |
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create a user |
| GET | `/api/users/:username` | Get user by username |
| PUT | `/api/users/:username/room` | Update user room |
| DELETE | `/api/users/:username` | Delete user |

### Socket.IO Events

See README.md for complete Socket.IO event documentation.

## Next Steps

1. **Connect Frontend**: Update frontend Socket.IO URL to `http://localhost:5000`
2. **Test Features**: Test room creation, code sync, chat, etc.
3. **Add Authentication**: Implement JWT authentication if needed
4. **Deploy**: Follow deployment guide in README.md
5. **Monitor**: Check logs in `logs/` folder

## Support

For issues or questions:
- Check logs in `logs/` folder
- Review error messages in console
- Ensure all environment variables are set
- Verify MongoDB is running and accessible

---

**Ready to code collaboratively! 🚀**
