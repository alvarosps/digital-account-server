import { Request, Response } from 'express';
import { AccountHolderService } from '../services/accountHolderService';

const accountHolderService = new AccountHolderService();

export class AccountHolderController {
  async createAccountHolder(req: Request, res: Response) {
    try {
      const accountHolderData = req.body;
      const newAccountHolder = await accountHolderService.createAccountHolder(
        accountHolderData
      );
      return res.status(201).json(newAccountHolder);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred creating the account holder',
      });
    }
  }

  async deleteAccountHolder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await accountHolderService.deleteAccountHolder(id);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred deleting the account holder',
      });
    }
  }

  async getAllAccountHolders(req: Request, res: Response) {
    try {
      const accountHolders = await accountHolderService.getAllAccountHolders();
      return res.status(200).json(accountHolders);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred getting all account holders',
      });
    }
  }

  async getAccountHolderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const accountHolder = await accountHolderService.getAccountHolderById(id);
      if (!accountHolder) {
        return res.status(404).json({ message: 'Account holder not found' });
      }
      return res.status(200).json(accountHolder);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred getting account holder by id',
      });
    }
  }

  async updateAccountHolder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedAccountHolderData = req.body;

      const updatedAccountHolder =
        await accountHolderService.updateAccountHolder(
          id,
          updatedAccountHolderData
        );

      if (!updatedAccountHolder) {
        res.status(404).send({ error: 'Account holder not found' });
        return;
      }

      res.send(updatedAccountHolder);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({
        message: 'An unexpected error occurred getting account holder by id',
      });
    }
  }
}
