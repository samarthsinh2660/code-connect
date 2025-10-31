import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
    id: string;
    username: string;
    content: string;
    timestamp: Date;
}

export interface IClient {
    socketId: string;
    username: string;
    joinedAt: Date;
}

export interface IRoom extends Document {
    roomId: string;
    clients: IClient[];
    code: string;
    language: string;
    messages: IMessage[];
    createdAt: Date;
    lastActivity: Date;
    isActive: boolean;
}

const MessageSchema = new Schema<IMessage>({
    id: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ClientSchema = new Schema<IClient>({
    socketId: { type: String, required: true },
    username: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
});

const RoomSchema = new Schema<IRoom>({
    roomId: { type: String, required: true, unique: true, index: true },
    clients: [ClientSchema],
    code: { type: String, default: '// Start coding here...' },
    language: { type: String, default: 'javascript' },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Index for faster queries
RoomSchema.index({ roomId: 1, isActive: 1 });
RoomSchema.index({ lastActivity: -1 });

// Update lastActivity on any modification
RoomSchema.pre('save', function(next) {
    this.lastActivity = new Date();
    next();
});

export const RoomModel = mongoose.model<IRoom>('Room', RoomSchema);
