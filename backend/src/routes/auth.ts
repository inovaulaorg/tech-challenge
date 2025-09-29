import { Router } from 'express';
import { register, login, getProfile, updateProfile, deleteUser, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, registerSchema, loginSchema, updateUserSchema } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateRequest(updateUserSchema), updateProfile);
router.delete('/profile', authenticateToken, deleteUser);

export default router;