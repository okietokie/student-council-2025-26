import express from 'express';
import * as admin from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
const router = express.Router();

router.use(authMiddleware);

router.post('/create-poll', admin.createPoll);
router.delete('/delete-poll/:pollId', admin.deletePoll);
router.put('/edit-poll/:pollId', admin.editPoll);
router.post('/finish-poll/:pollId', admin.finishPoll);

router.get('/fetch-polls', admin.getAllPolls);
router.put('/reopen-poll/:id', admin.reopenPoll)

router.post('/approve-user/:userId', admin.approveUser);
router.post('/reject-user/:targetUserId', admin.rejectUserRequest);

router.delete('/remove/:userIdToRemove', admin.removePeer);
router.patch("/make-admin/:userId", admin.makeAdmin);
router.patch('/remove-admin/:userId', admin.removeAsAdmin);

export default router;
