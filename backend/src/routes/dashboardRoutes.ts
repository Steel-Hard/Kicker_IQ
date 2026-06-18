import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken } from '../middlewares/jwt';

const router = Router();
const controller = new DashboardController();

router.get('/summary', authenticateToken, controller.getSummary);

export default router;
