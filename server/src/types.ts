import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Request } from 'express';

export interface RequestWithDynamoDBClient extends Request {
  dynamoDBClient: DynamoDBClient;
}
