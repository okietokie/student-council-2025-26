import express from 'express';
import * as user from '../controllers/userController.js';
import { authMiddleware as protect } from '../middleware/authmiddleware.js';
const router = express.Router();

router.use(protect);
router.get("/get-user-data", user.getUser);
router.post("/submit-vote", user.handleVote);
router.get("/get-peers", user.getPeers);

export default router;

