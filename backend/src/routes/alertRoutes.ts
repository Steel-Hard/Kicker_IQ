import { Router } from 'express';
import { AlertController } from '../controllers/AlertController';
import { authenticateToken } from '../middlewares/jwt';

const router = Router();
const controller = new AlertController();

router.get('/', authenticateToken, controller.getAll);
router.get('/count', authenticateToken, controller.getActiveCount);
router.get('/athlete/:athleteId', authenticateToken, controller.getByAthlete);
router.post('/', authenticateToken, controller.create);
router.patch('/:id/resolve', authenticateToken, controller.resolve);
router.delete('/:id', authenticateToken, controller.delete);

export default router;
