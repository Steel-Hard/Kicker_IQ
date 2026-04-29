import { Router } from 'express';
import userController from './userRoute';

const routes = Router();

routes.use('/auth', userController);


routes.use((_: any, res: any) =>
  res.json({ error: 'Requisição desconhecida' }),
);

export default routes;
