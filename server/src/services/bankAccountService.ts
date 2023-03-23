import { BankAccount, BankAccountStatus } from '../models/bankAccount';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dynamoDBClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const BANK_ACCOUNT_TABLE = 'bank-accounts';

function toDynamoDBItem(item: BankAccount): Record<string, AttributeValue> {
  const dynamoDBItem: Record<string, AttributeValue> = {};
  for (const [key, value] of Object.entries(item)) {
    if (value instanceof Date) {
      dynamoDBItem[key] = { S: value.toISOString() };
    } else {
      dynamoDBItem[key] = { S: value.toString() };
    }
  }

  return dynamoDBItem;
}

function toBankAccount(item: Record<string, AttributeValue>): BankAccount {
  const bankAccount: BankAccount = {
    id: item.id.S ?? '',
    accountHolderId: item.accountHolderId.S ?? '',
    agency: item.agency.S ?? '',
    accountNumber: item.accountNumber.S ?? '',
    balance: item.balance?.N ? +item.balance.N : 0,
    createdAt: item.createdAt?.S ? new Date(item.createdAt.S) : new Date(),
    updatedAt: item.updatedAt?.S ? new Date(item.updatedAt.S) : new Date(),
    status: item.status.S as BankAccountStatus,
  };
  return bankAccount;
}

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
      Item: toDynamoDBItem(newBankAccount),
    };

    await dynamoDBClient.send(new PutItemCommand(params));
    return newBankAccount;
  }

  public async getBankAccountById(
    id: string
  ): Promise<BankAccount | undefined> {
    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id: { S: id },
      },
    };

    const result = await dynamoDBClient.send(new GetItemCommand(params));
    if (result.Item) {
      return toBankAccount(result.Item);
    }
    return undefined;
  }

  public async getAllBankAccounts(): Promise<BankAccount[]> {
    const params = {
      TableName: BANK_ACCOUNT_TABLE,
    };

    const result = await dynamoDBClient.send(new ScanCommand(params));

    if (!result.Items) {
      return [];
    }

    return result.Items.map(item => toBankAccount(item));
  }

  public async deposit(
    id: string,
    amount: number
  ): Promise<BankAccount | null> {
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount || bankAccount.status !== BankAccountStatus.ACTIVE) {
      return null;
    }

    bankAccount.balance += amount;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id: { S: id },
      },
      UpdateExpression: 'SET #balance = :balance',
      ExpressionAttributeNames: {
        '#balance': 'balance',
      },
      ExpressionAttributeValues: {
        ':balance': { N: bankAccount.balance.toString() },
      },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));

    return bankAccount;
  }

  public async withdraw(
    id: string,
    amount: number
  ): Promise<BankAccount | null> {
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
        id: { S: id },
      },
      UpdateExpression: 'SET #balance = :balance',
      ExpressionAttributeNames: {
        '#balance': 'balance',
      },
      ExpressionAttributeValues: {
        ':balance': { N: bankAccount.balance.toString() },
      },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));
    return bankAccount;
  }

  public async blockBankAccount(id: string): Promise<BankAccount | null> {
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount) {
      return null;
    }

    bankAccount.status = BankAccountStatus.BLOCKED;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id: { S: id },
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': { S: bankAccount.status },
        ':updatedAt': { S: new Date().toISOString() },
      },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));
    return bankAccount;
  }

  public async unblockBankAccount(id: string): Promise<BankAccount | null> {
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount) {
      return null;
    }

    bankAccount.status = BankAccountStatus.ACTIVE;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id: { S: id },
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': { S: bankAccount.status },
        ':updatedAt': { S: new Date().toISOString() },
      },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));
    return bankAccount;
  }

  public async updateBankAccount(
    id: string,
    updatedBankAccountData: Partial<Omit<BankAccount, 'id'>>
  ): Promise<BankAccount | null> {
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
        id: { S: id },
      },
      UpdateExpression:
        'SET #status = :status, #balance = :balance, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#balance': 'balance',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': { S: updatedBankAccount.status },
        ':balance': { N: updatedBankAccount.balance.toString() },
        ':updatedAt': { S: updatedBankAccount.updatedAt.toISOString() },
      },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));
    return updatedBankAccount;
  }

  public async closeBankAccount(id: string): Promise<BankAccount | null> {
    const bankAccount = await this.getBankAccountById(id);

    if (!bankAccount || bankAccount.status !== BankAccountStatus.ACTIVE) {
      return null;
    }

    bankAccount.status = BankAccountStatus.CLOSED;

    const params = {
      TableName: BANK_ACCOUNT_TABLE,
      Key: {
        id: { S: id },
      },
      UpdateExpression: 'SET #status = :status, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':status': { S: bankAccount.status },
        ':updatedAt': { S: new Date().toISOString() },
      },
    };

    await dynamoDBClient.send(new UpdateItemCommand(params));

    return bankAccount;
  }
}
