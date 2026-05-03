import { Router } from 'express';
import userController from './userRoute';
import modelRoutes from './modelRoute';

const routes = Router();

routes.use('/auth', userController);
routes.use('/model', modelRoutes);


routes.use((_: any, res: any) =>
  res.json({ error: 'Requisição desconhecida' }),
);

export default routes;
