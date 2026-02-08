import express from 'express';
import * as user from '../controllers/userController.js';
import { authMiddleware as protect } from '../middleware/authmiddleware.js';
import * as upload from "../middleware/upload.js";


const router = express.Router();
router.use(protect);
router.get("/get-user-data", user.getUser);
router.post("/submit-vote", user.handleVote);
router.get("/get-peers", user.getPeers);
router.post("/upload-avatar", upload.avatarUpload.single("avatar"), user.uploadAvatar);
router.delete("/delete-avatar", user.deleteAvatar);

export default router;

