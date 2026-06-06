import express from 'express';
import { getUserDashboard, clearReadingHistory } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getUserDashboard);
router.delete('/history', protect, clearReadingHistory);

export default router;
