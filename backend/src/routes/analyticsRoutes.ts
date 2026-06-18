import { Router } from 'express';
import AnalyticsController from '../controllers/AnalyticsController';
import { authenticateToken } from '../middlewares/jwt';

const routes = Router();

routes.get('/stats', authenticateToken, AnalyticsController.getStats);
routes.get('/atletas', authenticateToken, AnalyticsController.getAtletas);
routes.post('/radar', authenticateToken, AnalyticsController.getRadarData);
routes.get('/history/:id', authenticateToken, AnalyticsController.getAthleteHistory);
routes.get('/similarity/:id', authenticateToken, AnalyticsController.getSimilarAthletes);

export default routes;
