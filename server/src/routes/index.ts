import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  res.send('Base route');
});

export default routes;
