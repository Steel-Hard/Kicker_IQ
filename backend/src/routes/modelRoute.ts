import { Router } from 'express';
import AthleteModelController from '../controllers/AthleteModelController';
import { authenticateToken } from '../middlewares/jwt';

const routes = Router();

// Protegemos a rota com o token JWT do backend principal
routes.post('/predict', authenticateToken, AthleteModelController.getProfile);

export default routes;
