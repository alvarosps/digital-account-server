import express, { RequestHandler } from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { RequestWithDynamoDBClient } from './types';

dotenv.config();

if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION
) {
  throw new Error('AWS credentials or region not set in environment variables');
}

const dynamoDBClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(((req: RequestWithDynamoDBClient, res, next) => {
  req.dynamoDBClient = dynamoDBClient;
  next();
}) as RequestHandler);
app.use(routes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
