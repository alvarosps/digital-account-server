import { AccountHolder } from '../models/accountHolder';
import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  GetItemCommand,
  UpdateItemCommand,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const ACCOUNT_HOLDERS_TABLE = 'account-holders';

function toDynamoDBItem(item: AccountHolder): Record<string, AttributeValue> {
  const dynamoDBItem: Record<string, AttributeValue> = {};
  for (const [key, value] of Object.entries(item)) {
    if (value !== undefined) {
      dynamoDBItem[key] = { S: value };
    }
  }

  return dynamoDBItem;
}

function fromDynamoDBItem(item: Record<string, AttributeValue>): AccountHolder {
  const accountHolder: Partial<AccountHolder> = {};

  for (const [key, value] of Object.entries(item)) {
    if (key === 'id' || key === 'fullName' || key === 'cpf') {
      accountHolder[key] = value.S as string;
    }
  }

  return accountHolder as AccountHolder;
}

export class AccountHolderService {
  public async createAccountHolder(
    accountHolderData: Omit<AccountHolder, 'id'>
  ): Promise<AccountHolder> {
    const newAccountHolder: AccountHolder = {
      ...accountHolderData,
      id: uuidv4(),
    };

    const params = {
      TableName: ACCOUNT_HOLDERS_TABLE,
      Item: toDynamoDBItem(newAccountHolder),
    };

    await dynamoDB.send(new PutItemCommand(params));
    return newAccountHolder;
  }

  public async deleteAccountHolder(id: string): Promise<boolean> {
    const params = {
      TableName: ACCOUNT_HOLDERS_TABLE,
      Key: {
        id: { S: id },
      },
    };

    const result = await dynamoDB.send(new DeleteItemCommand(params));
    return !!result.Attributes;
  }

  public async getAllAccountHolders(): Promise<AccountHolder[]> {
    const params = {
      TableName: ACCOUNT_HOLDERS_TABLE,
    };

    const result = await dynamoDB.send(new ScanCommand(params));
    return (result.Items as Record<string, AttributeValue>[]).map(
      fromDynamoDBItem
    );
  }

  public async getAccountHolderById(
    id: string
  ): Promise<AccountHolder | undefined> {
    const params = {
      TableName: ACCOUNT_HOLDERS_TABLE,
      Key: {
        id: { S: id },
      },
    };

    const result = await dynamoDB.send(new GetItemCommand(params));
    if (result.Item) {
      return fromDynamoDBItem(result.Item);
    }
    return undefined;
  }

  public async updateAccountHolder(
    id: string,
    updatedAccountHolderData: Partial<Omit<AccountHolder, 'id'>>
  ): Promise<AccountHolder | null> {
    const accountHolder = await this.getAccountHolderById(id);

    if (!accountHolder) {
      return null;
    }

    const updatedAccountHolder: AccountHolder = {
      ...accountHolder,
      ...updatedAccountHolderData,
    };

    const updateExpressionComponents = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (updatedAccountHolderData.fullName) {
      updateExpressionComponents.push('#fullName = :fullName');
      expressionAttributeNames['#fullName'] = 'fullName';
      expressionAttributeValues[':fullName'] = {
        S: updatedAccountHolder.fullName,
      };
    }

    if (updatedAccountHolderData.cpf) {
      updateExpressionComponents.push('#cpf = :cpf');
      expressionAttributeNames['#cpf'] = 'cpf';
      expressionAttributeValues[':cpf'] = { S: updatedAccountHolder.cpf };
    }

    if (updateExpressionComponents.length === 0) {
      return accountHolder;
    }

    const params = {
      TableName: ACCOUNT_HOLDERS_TABLE,
      Key: {
        id: { S: id },
      },
      UpdateExpression: 'SET ' + updateExpressionComponents.join(', '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    await dynamoDB.send(new UpdateItemCommand(params));
    return updatedAccountHolder;
  }
}
