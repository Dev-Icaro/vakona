import { Router } from 'express';
import authRouter from '@modules/user/presentation/routes/auth.routes';
import userRouter from '@modules/user/presentation/routes/user.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

routes.use('/auth', authRouter);
routes.use('/user', userRouter);

export default routes;
