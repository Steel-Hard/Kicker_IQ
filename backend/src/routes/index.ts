import { Router } from 'express';
import userController from './userRoute';
import modelRoutes from './modelRoute';
import athleteRoutes from './athleteRoutes';

const routes = Router();

routes.use('/auth', userController);
routes.use('/model', modelRoutes);
routes.use('/athletes', athleteRoutes)


routes.use((_: any, res: any) =>
  res.json({ error: 'Requisição desconhecida' }),
);

export default routes;
