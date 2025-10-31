import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email?: string;
    password?: string;
    socketId?: string;
    currentRoom?: string;
    lastSeen: Date;
    createdAt: Date;

    // Profile fields
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    clerkId?: string; // Link to Clerk user
    provider?: 'email' | 'google' | 'github' | 'linkedin';
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true },
    password: { type: String },
    socketId: { type: String },
    currentRoom: { type: String },
    lastSeen: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },

    // Profile fields
    firstName: { type: String },
    lastName: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    clerkId: { type: String, sparse: true, index: true }, // Link to Clerk user
    provider: { type: String, enum: ['email', 'google', 'github', 'linkedin'], default: 'email' }
}, {
    timestamps: true
});

// Indexes for faster queries
UserSchema.index({ username: 1 });
UserSchema.index({ socketId: 1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
