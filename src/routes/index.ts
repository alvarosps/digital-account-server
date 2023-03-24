import { Router } from 'express';
import AccountHolderRoutes from './accountHolderRoutes';
import BankAccountRoutes from './bankAccountRoutes';

const routes = Router();

routes.use('/accountHolders', AccountHolderRoutes);
routes.use('/bankAccounts', BankAccountRoutes);

routes.get('/', (req, res) => {
  res.send('Base route');
});

export default routes;
