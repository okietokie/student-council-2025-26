import express from 'express';
import * as auth from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
const router = express.Router();

// Public routes
router.post('/register', auth.registerUser);
router.post('/login', auth.loginUser);
router.patch("/logout", authMiddleware, auth.logoutUser);


export default router;