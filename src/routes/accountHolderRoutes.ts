// src/routes/accountHolderRoutes.ts
import express from 'express';
import { AccountHolderController } from '../controllers/accountHolderController';

const router = express.Router();
const accountHolderController = new AccountHolderController();

router.post('/', accountHolderController.createAccountHolder);
router.get('/', accountHolderController.getAllAccountHolders);
router.get('/:id', accountHolderController.getAccountHolderById);
router.put('/:id', accountHolderController.updateAccountHolder);
router.delete('/:id', accountHolderController.deleteAccountHolder);

export default router;
