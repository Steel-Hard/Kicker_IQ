import { Router } from 'express';
import { AthleteController } from '../controllers/AthleteDataController';
import { authenticateToken } from '../middlewares/jwt';

const router = Router();
const controller = new AthleteController();

router.get('/', authenticateToken, controller.getAll);
router.get('/date/:date', authenticateToken, controller.getByDate);
router.get('/:id', authenticateToken, controller.getById);
router.post('/import', authenticateToken, controller.importAthletes);

export default router;
