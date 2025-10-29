# Code Connect

A modern, real-time collaborative code editor platform that enables developers to code together seamlessly with features like live editing, chat, whiteboard, AI assistance, and immersive UI effects.

## ✨ Features

- **Real-time Collaboration**: Live code synchronization across multiple users in the same room
- **Dual Editors**: Support for both Monaco Editor (VS Code-like) and CodeMirror editors
- **Interactive Whiteboard**: Draw and collaborate visually alongside code
- **Real-time Chat**: Instant messaging with emoji support and typing indicators
- **AI Assistant**: Integrated AI chat for coding help and suggestions (powered by Google Gemini and OpenAI)
- **Code Compilation**: Run and test code snippets with live console output
- **Fluid Cursor Effects**: Immersive WebGL-based fluid simulation for cursor interactions
- **Authentication**: Secure user authentication via Clerk
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Dark/Light Themes**: Automatic theme switching with next-themes
- **Animations**: Smooth animations powered by Framer Motion and GSAP

## 🏗️ Architecture

### Frontend
The application is built as a **Next.js 15** React application with the following stack:

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for React animations, GSAP for advanced animations
- **3D Graphics**: Three.js with React Three Fiber for fluid simulations
- **Editors**: Monaco Editor and CodeMirror for code editing
- **State Management**: React hooks and context providers
- **Real-time Communication**: Socket.IO client for WebSocket connections
- **Authentication**: Clerk for user management
- **Icons**: Lucide React icon library

### Backend
The backend is a separate **Node.js Socket.IO server** deployed on Railway:

- **Server**: Node.js with Socket.IO for real-time bidirectional communication
- **Hosting**: Railway (https://code-connect-server-production.up.railway.app)
- **Database**: (Not specified in frontend code, likely uses in-memory storage or external DB)

### How It Works

1. **Authentication Flow**:
   - Users authenticate via Clerk on the landing page
   - Upon successful login, users can access the collaborative editor

2. **Room Creation & Joining**:
   - Rooms are identified by unique IDs in the URL path (`/editor/[roomId]`)
   - Users join rooms by navigating to specific room URLs
   - Room state is synchronized in real-time across all connected clients

3. **Real-time Collaboration**:
   - **Code Sync**: Code changes are broadcast via Socket.IO events (`CODE_CHANGE`, `SYNC_CODE`)
   - **User Presence**: Join/leave events track active users in rooms
   - **Typing Indicators**: Shows when users are typing (`TYPING`, `STOP_TYPING`)
   - **Chat System**: Real-time messaging with message synchronization

4. **Code Execution**:
   - Code compilation requests are sent to the backend
   - Backend processes code and returns output via `COMPILE_RESULT`
   - Console output is displayed in a dedicated panel

5. **AI Integration**:
   - AI chat interface powered by Google Gemini AI
   - Context-aware code suggestions and explanations
   - Integrated directly in the editor interface

6. **Fluid Cursor System**:
   - WebGL-based fluid simulation using custom shaders
   - Tracks cursor movements and creates particle effects
   - Enhances user experience with visual feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/code-connect.git
cd code-connect
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SOCKET_URL=https://code-connect-server-production.up.railway.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── landing.tsx        # Landing page component
│   ├── editor/[roomid]/   # Dynamic editor routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── Editor/           # Editor-specific components
│   │   ├── Client.tsx    # User list component
│   │   ├── Chat.tsx      # Chat interface
│   │   ├── WhiteBoard.tsx # Drawing whiteboard
│   │   └── AiAssistant.tsx # AI chat component
│   └── Dashboard/        # Landing page components
├── hooks/                 # Custom React hooks
│   └── use-FluidCursor.ts # Fluid simulation hook
├── lib/                   # Utility functions and constants
│   └── actions.ts        # Socket.IO action types
├── providers/            # React context providers
│   └── socketProvider.tsx # Socket.IO connection provider
└── types/                 # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run shadcn` - Run shadcn/ui CLI

## 🚀 Deployment

### Frontend Deployment
The easiest way to deploy the Next.js app is to use [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Backend Deployment
The Socket.IO server is deployed on Railway. For local development or custom deployment:

1. Clone the backend repository (separate repo)
2. Set up environment variables
3. Deploy to your preferred hosting platform (Railway, Heroku, AWS, etc.)

## 🛠️ Tech Stack Details

### Frontend Dependencies
- **UI Framework**: Next.js 15, React 18
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: Framer Motion, GSAP
- **Editors**: Monaco Editor, CodeMirror
- **3D Graphics**: Three.js, React Three Fiber
- **Real-time**: Socket.IO Client
- **Authentication**: Clerk
- **AI**: Google Generative AI, OpenAI
- **Icons**: Lucide React
- **State**: React Hooks, Context API

### Key Libraries
- `@codemirror/*`: CodeMirror editor integration
- `@monaco-editor/react`: Monaco editor wrapper
- `@react-three/fiber`: React renderer for Three.js
- `@radix-ui/*`: Headless UI components
- `framer-motion`: Animation library
- `socket.io-client`: WebSocket client
- `openai`: OpenAI API client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with inspiration from modern collaborative coding platforms
- UI components from shadcn/ui
- Fluid simulation based on WebGL techniques
- Icons from Lucide React


