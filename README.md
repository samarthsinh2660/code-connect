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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
