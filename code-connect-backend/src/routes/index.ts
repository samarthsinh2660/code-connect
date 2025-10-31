import { Router } from 'express';
import roomRoutes from './room.routes.js';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/users', userRoutes);

export default router;
