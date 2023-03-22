import { BankAccount, BankAccountStatus } from '../models/bankAccount';

export class BankAccountService {
  private bankAccounts: BankAccount[] = [];

  public createBankAccount(accountHolderId: string): BankAccount {
    const newBankAccount: BankAccount = {
      id: Date.now().toString(),
      accountHolderId,
      status: BankAccountStatus.ACTIVE,
      balance: 0,
      agency: (Math.floor(Math.random() * 90000) + 10000).toString(),
      accountNumber: (Math.floor(Math.random() * 9000000) + 1000000).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bankAccounts.push(newBankAccount);
    return newBankAccount;
  }

  public getBankAccountById(id: string): BankAccount | undefined {
    return this.bankAccounts.find(bankAccount => bankAccount.id === id);
  }

  public getAllBankAccounts(): BankAccount[] {
    return this.bankAccounts;
  }

  public deposit(id: string, amount: number): BankAccount | null {
    const bankAccountIndex = this.bankAccounts.findIndex(
      bankAccount => bankAccount.id === id
    );

    if (
      bankAccountIndex === -1 ||
      this.bankAccounts[bankAccountIndex].status !== BankAccountStatus.ACTIVE
    ) {
      return null;
    }

    this.bankAccounts[bankAccountIndex].balance += amount;
    return this.bankAccounts[bankAccountIndex];
  }

  public withdraw(id: string, amount: number): BankAccount | null {
    const bankAccountIndex = this.bankAccounts.findIndex(
      bankAccount => bankAccount.id === id
    );

    if (
      bankAccountIndex === -1 ||
      this.bankAccounts[bankAccountIndex].status !== BankAccountStatus.ACTIVE ||
      this.bankAccounts[bankAccountIndex].balance < amount
    ) {
      return null;
    }

    this.bankAccounts[bankAccountIndex].balance -= amount;
    return this.bankAccounts[bankAccountIndex];
  }

  public blockBankAccount(id: string): BankAccount | null {
    const bankAccountIndex = this.bankAccounts.findIndex(
      bankAccount => bankAccount.id === id
    );

    if (bankAccountIndex === -1) {
      return null;
    }

    this.bankAccounts[bankAccountIndex].status = BankAccountStatus.BLOCKED;
    return this.bankAccounts[bankAccountIndex];
  }

  public unblockBankAccount(id: string): BankAccount | null {
    const bankAccountIndex = this.bankAccounts.findIndex(
      bankAccount => bankAccount.id === id
    );

    if (bankAccountIndex === -1) {
      return null;
    }

    this.bankAccounts[bankAccountIndex].status = BankAccountStatus.ACTIVE;
    return this.bankAccounts[bankAccountIndex];
  }

  public updateBankAccount(
    id: string,
    updatedBankAccountData: Partial<Omit<BankAccount, 'id'>>
  ): BankAccount | null {
    const bankAccountIndex = this.bankAccounts.findIndex(
      bankAccount => bankAccount.id === id
    );

    if (bankAccountIndex === -1) {
      return null;
    }

    this.bankAccounts[bankAccountIndex] = {
      ...this.bankAccounts[bankAccountIndex],
      ...updatedBankAccountData,
      updatedAt: new Date(),
    };

    return this.bankAccounts[bankAccountIndex];
  }

  public closeBankAccount(id: string): BankAccount | null {
    const bankAccountIndex = this.bankAccounts.findIndex(
      bankAccount => bankAccount.id === id
    );

    if (
      bankAccountIndex === -1 ||
      this.bankAccounts[bankAccountIndex].status !== BankAccountStatus.ACTIVE
    ) {
      return null;
    }

    this.bankAccounts[bankAccountIndex].status = BankAccountStatus.CLOSED;
    return this.bankAccounts[bankAccountIndex];
  }
}
