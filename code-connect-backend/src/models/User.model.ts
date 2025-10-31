import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email?: string;
    password?: string;
    socketId?: string;
    currentRoom?: string;
    lastSeen: Date;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true },
    password: { type: String },
    socketId: { type: String },
    currentRoom: { type: String },
    lastSeen: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Indexes for faster queries
UserSchema.index({ username: 1 });
UserSchema.index({ socketId: 1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
