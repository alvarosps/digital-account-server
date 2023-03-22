import { AccountHolder } from '../models/accountHolder';

export class AccountHolderService {
  private accountHolders: AccountHolder[] = [];

  public createAccountHolder(
    accountHolderData: Omit<AccountHolder, 'id'>
  ): AccountHolder {
    const newAccountHolder: AccountHolder = {
      ...accountHolderData,
      id: Date.now(),
    };

    this.accountHolders.push(newAccountHolder);
    return newAccountHolder;
  }

  public deleteAccountHolder(id: number): boolean {
    const initialLength = this.accountHolders.length;
    this.accountHolders = this.accountHolders.filter(
      accountHolder => accountHolder.id !== id
    );
    return initialLength > this.accountHolders.length;
  }

  public getAllAccountHolders(): AccountHolder[] {
    return this.accountHolders;
  }

  public getAccountHolderById(id: number): AccountHolder | undefined {
    return this.accountHolders.find(accountHolder => accountHolder.id === id);
  }

  public updateAccountHolder(
    id: number,
    updatedAccountHolderData: Partial<Omit<AccountHolder, 'id'>>
  ): AccountHolder | null {
    const accountHolderIndex = this.accountHolders.findIndex(
      accountHolder => accountHolder.id === id
    );

    if (accountHolderIndex === -1) {
      return null;
    }

    this.accountHolders[accountHolderIndex] = {
      ...this.accountHolders[accountHolderIndex],
      ...updatedAccountHolderData,
    };

    return this.accountHolders[accountHolderIndex];
  }
}
