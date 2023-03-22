// src/routes/bankAccountRoutes.ts
import express from 'express';
import { BankAccountController } from '../controllers/bankAccountController';

const router = express.Router();
const bankAccountController = new BankAccountController();

router.post('/', bankAccountController.createBankAccount);
router.get('/', bankAccountController.getAllBankAccounts);
router.get('/:id', bankAccountController.getBankAccountById);
router.put('/:id', bankAccountController.updateBankAccount);
router.delete('/:id', bankAccountController.closeBankAccount);
router.post('/:id/deposit', bankAccountController.deposit);
router.post('/:id/withdraw', bankAccountController.withdraw);
router.post('/:id/block', bankAccountController.blockBankAccount);
router.post('/:id/unblock', bankAccountController.unblockBankAccount);

export default router;
