import express from 'express';
import * as auth from '../controllers/authController.js';
const router = express.Router();

// Public routes
router.post('/register', auth.registerUser);
router.post('/login', auth.loginUser);


export default router;