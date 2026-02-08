// In your server routes file (e.g., server/routes/classRoutes.js)
import express from 'express';
import * as classes from '../controllers/classController.js';

const router = express.Router();

router.get('', classes.getClasses);
router.get('/get-polls', classes.getLatestPolls);
export default router;