import { Router } from 'express';
import userController from './userRoute';
import modelRoutes from './modelRoute';
import athleteRoutes from './athleteRoutes';
import alertRoutes from './alertRoutes';

const routes = Router();

routes.use('/auth', userController);
routes.use('/model', modelRoutes);
routes.use('/athletes', athleteRoutes);
routes.use('/alerts', alertRoutes);

routes.use((_: any, res: any) =>
  res.json({ error: 'Requisição desconhecida' }),
);

export default routes;
