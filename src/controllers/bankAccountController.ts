import { Request, Response } from 'express';
import { BankAccountService } from '../services/bankAccountService';

const bankAccountService = new BankAccountService();

export class BankAccountController {
  async createBankAccount(req: Request, res: Response) {
    try {
      const { accountHolderId } = req.body;
      const newBankAccount = await bankAccountService.createBankAccount(
        accountHolderId
      );
      return res.status(201).json(newBankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred creating new bank account',
      });
    }
  }

  async deposit(req: Request, res: Response) {
    try {
      const { accountId, amount } = req.body;
      const updatedBankAccount = await bankAccountService.deposit(
        accountId,
        amount
      );
      return res.status(200).json(updatedBankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred doing a deposit in bank account',
      });
    }
  }

  async withdraw(req: Request, res: Response) {
    try {
      const { accountId, amount } = req.body;
      const updatedBankAccount = await bankAccountService.withdraw(
        accountId,
        amount
      );
      return res.status(200).json(updatedBankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred withdrawing from bank account',
      });
    }
  }

  async getBankAccountById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bankAccount = await bankAccountService.getBankAccountById(id);
      return res.status(200).json(bankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred getting bank account by id',
      });
    }
  }

  async getAllBankAccounts(req: Request, res: Response) {
    try {
      const bankAccounts = await bankAccountService.getAllBankAccounts();
      return res.status(200).json(bankAccounts);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred getting all bank accounts',
      });
    }
  }

  async updateBankAccount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedBankAccount = await bankAccountService.updateBankAccount(
        id,
        req.body
      );

      if (!updatedBankAccount) {
        return res
          .status(404)
          .json({ message: `Bank account with id ${id} not found` });
      }

      return res.status(200).json(updatedBankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred updating bank account',
      });
    }
  }

  async closeBankAccount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const closedBankAccount = await bankAccountService.closeBankAccount(id);

      if (!closedBankAccount) {
        return res
          .status(404)
          .json({ message: `Bank account with id ${id} not found` });
      }

      return res.status(200).json(closedBankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred closing bank account',
      });
    }
  }

  async blockBankAccount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const blockedBankAccount = await bankAccountService.blockBankAccount(id);

      if (!blockedBankAccount) {
        return res
          .status(404)
          .json({ message: `Bank account with id ${id} not found` });
      }

      return res.status(200).json(blockedBankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred blocking bank account',
      });
    }
  }

  async unblockBankAccount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const unblockedBankAccount = await bankAccountService.unblockBankAccount(
        id
      );

      if (!unblockedBankAccount) {
        return res
          .status(404)
          .json({ message: `Bank account with id ${id} not found` });
      }

      return res.status(200).json(unblockedBankAccount);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred unblocking bank account',
      });
    }
  }
}
