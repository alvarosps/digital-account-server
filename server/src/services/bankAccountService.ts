import { BankAccount, BankAccountStatus } from '../models/bankAccount';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const REGION = process.env.AWS_REGION;
const dynamoDB = new DynamoDB.DocumentClient({ region: REGION });
const BANK_ACCOUNT_TABLE = 'bank-accounts';

export class BankAccountService {
  private bankAccounts: BankAccount[] = [];

  public async createBankAccount(
    accountHolderId: string
  ): Promise<BankAccount> {
    const newBankAccount: BankAccount = {
      id: uuidv4(),
      accountHolderId,
      status: BankAccountStatus.ACTIVE,
      balance: 0,
      agency: (Math.floor(Math.random() * 90000) + 10000).toString(),
      accountNumber: (Math.floor(Math.random() * 9000000) + 1000000).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Item: newBankAccount,
    };

    await dynamoDB.put(params).promise();
    return newBankAccount;
  }

  public async getBankAccountById(
    id: string
  ): Promise<BankAccount | undefined> {
    // return this.bankAccounts.find(bankAccount => bankAccount.id === id);
    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id,
      },
    };

    const result = await dynamoDB.get(params).promise();
    return result.Item as BankAccount | undefined;
  }

  public async getAllBankAccounts(): Promise<BankAccount[]> {
    // return this.bankAccounts;
    const params = {
      TableName: BANK_ACCOUNT_TABLE,
    };

    const result = await dynamoDB.scan(params).promise();
    return result.Items as BankAccount[];
  }

  public async deposit(
    id: string,
    amount: number
  ): Promise<BankAccount | null> {
    // const bankAccountIndex = this.bankAccounts.findIndex(
    //   bankAccount => bankAccount.id === id
    // );

    // if (
    //   bankAccountIndex === -1 ||
    //   this.bankAccounts[bankAccountIndex].status !== BankAccountStatus.ACTIVE
    // ) {
    //   return null;
    // }

    // this.bankAccounts[bankAccountIndex].balance += amount;
    // return this.bankAccounts[bankAccountIndex];
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount || bankAccount.status !== BankAccountStatus.ACTIVE) {
      return null;
    }

    bankAccount.balance += amount;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id,
      },
      UpdateExpression: 'SET #balance = :balance',
      ExpressionAttributeNames: {
        '#balance': 'balance',
      },
      ExpressionAttributeValues: {
        ':balance': bankAccount.balance,
      },
    };

    await dynamoDB.update(params).promise();
    return bankAccount;
  }

  public async withdraw(
    id: string,
    amount: number
  ): Promise<BankAccount | null> {
    // const bankAccountIndex = this.bankAccounts.findIndex(
    //   bankAccount => bankAccount.id === id
    // );

    // if (
    //   bankAccountIndex === -1 ||
    //   this.bankAccounts[bankAccountIndex].status !== BankAccountStatus.ACTIVE ||
    //   this.bankAccounts[bankAccountIndex].balance < amount
    // ) {
    //   return null;
    // }

    // this.bankAccounts[bankAccountIndex].balance -= amount;
    // return this.bankAccounts[bankAccountIndex];
    const bankAccount = await this.getBankAccountById(id);

    if (
      !bankAccount ||
      bankAccount.status !== BankAccountStatus.ACTIVE ||
      bankAccount.balance < amount
    ) {
      return null;
    }

    bankAccount.balance -= amount;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id,
      },
      UpdateExpression: 'SET #balance = :balance',
      ExpressionAttributeNames: {
        '#balance': 'balance',
      },
      ExpressionAttributeValues: {
        ':balance': bankAccount.balance,
      },
    };

    await dynamoDB.update(params).promise();
    return bankAccount;
  }

  public async blockBankAccount(id: string): Promise<BankAccount | null> {
    // const bankAccountIndex = this.bankAccounts.findIndex(
    //   bankAccount => bankAccount.id === id
    // );
    // if (bankAccountIndex === -1) {
    //   return null;
    // }
    // this.bankAccounts[bankAccountIndex].status = BankAccountStatus.BLOCKED;
    // return this.bankAccounts[bankAccountIndex];
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount) {
      return null;
    }

    bankAccount.status = BankAccountStatus.BLOCKED;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id,
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': bankAccount.status,
        ':updatedAt': new Date().toISOString(),
      },
    };

    await dynamoDB.update(params).promise();
    return bankAccount;
  }

  public async unblockBankAccount(id: string): Promise<BankAccount | null> {
    // const bankAccountIndex = this.bankAccounts.findIndex(
    //   bankAccount => bankAccount.id === id
    // );

    // if (bankAccountIndex === -1) {
    //   return null;
    // }

    // this.bankAccounts[bankAccountIndex].status = BankAccountStatus.ACTIVE;
    // return this.bankAccounts[bankAccountIndex];
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount) {
      return null;
    }

    bankAccount.status = BankAccountStatus.ACTIVE;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id,
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': bankAccount.status,
        ':updatedAt': new Date().toISOString(),
      },
    };

    await dynamoDB.update(params).promise();
    return bankAccount;
  }

  public async updateBankAccount(
    id: string,
    updatedBankAccountData: Partial<Omit<BankAccount, 'id'>>
  ): Promise<BankAccount | null> {
    // const bankAccountIndex = this.bankAccounts.findIndex(
    //   bankAccount => bankAccount.id === id
    // );

    // if (bankAccountIndex === -1) {
    //   return null;
    // }

    // this.bankAccounts[bankAccountIndex] = {
    //   ...this.bankAccounts[bankAccountIndex],
    //   ...updatedBankAccountData,
    //   updatedAt: new Date(),
    // };

    // return this.bankAccounts[bankAccountIndex];
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount) {
      return null;
    }

    const updatedBankAccount = {
      ...bankAccount,
      ...updatedBankAccountData,
      updatedAt: new Date(),
    };

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id,
      },
      UpdateExpression:
        'SET #status = :status, #balance = :balance, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#balance': 'balance',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': updatedBankAccount.status,
        ':balance': updatedBankAccount.balance,
        ':updatedAt': updatedBankAccount.updatedAt.toISOString(),
      },
    };

    await dynamoDB.update(params).promise();
    return updatedBankAccount;
  }

  public async closeBankAccount(id: string): Promise<BankAccount | null> {
    // const bankAccountIndex = this.bankAccounts.findIndex(
    //   bankAccount => bankAccount.id === id
    // );

    // if (
    //   bankAccountIndex === -1 ||
    //   this.bankAccounts[bankAccountIndex].status !== BankAccountStatus.ACTIVE
    // ) {
    //   return null;
    // }

    // this.bankAccounts[bankAccountIndex].status = BankAccountStatus.CLOSED;
    // return this.bankAccounts[bankAccountIndex];
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount || bankAccount.status !== BankAccountStatus.ACTIVE) {
      return null;
    }

    bankAccount.status = BankAccountStatus.CLOSED;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id,
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': bankAccount.status,
        ':updatedAt': new Date().toISOString(),
      },
    };

    await dynamoDB.update(params).promise();
    return bankAccount;
  }
}
