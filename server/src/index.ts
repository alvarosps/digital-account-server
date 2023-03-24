import express, { RequestHandler } from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { RequestWithDynamoDBClient } from './types';
import { auth } from 'express-oauth2-jwt-bearer';
import yaml from 'yamljs';
import * as path from 'path';
import swaggerUi from 'swagger-ui-express';

const openApiSpec = yaml.load(path.join(__dirname, '../openapi/openapi.yaml'));

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

if (
  !process.env.AUTH0_AUDIENCE ||
  !process.env.AUTH0_ISSUER_BASE_URL ||
  !process.env.AUTH0_TOKEN_SIGNING_ALGORITHM
) {
  throw new Error('Auth0 credentials not set in environment variables');
}

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALGORITHM,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(((req: RequestWithDynamoDBClient, res, next) => {
  req.dynamoDBClient = dynamoDBClient;
  next();
}) as RequestHandler);
app.use(jwtCheck);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use(routes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
