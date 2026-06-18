import { Router } from 'express';
import AthleteModelController from '../controllers/AthleteModelController';
import { authenticateToken } from '../middlewares/jwt';

const routes = Router();

// Protegemos a rota com o token JWT do backend principal
routes.post('/predict', authenticateToken, AthleteModelController.getProfile);
routes.get(
  '/team-classification',
  authenticateToken,
  AthleteModelController.getTeamClassification,
);
routes.get(
  '/athlete/:id/timeline',
  authenticateToken,
  AthleteModelController.getAthleteTimeline,
);

export default routes;
