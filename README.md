# Bank API

This is an API for a banking system that allows users to create and manage bank accounts.

## Technologies

This project uses the following technologies:

- Node.js
- Express.js
- AWS Dynamo DB

## Setup

To set up this project, follow these steps:

- Clone this repository to your local machine.
- Install dependencies by running npm install.
- Set the environment variables defined in .env.example. You can either create a .env file or set them in your environment.
- Start the server by running npm start.

Server will run on http://localhost:3000

## Authentication

This API uses auth0 authentication, you'll need to have the header 'Authorization' in the requests (and API Documentation) to use it.

### Getting the access_token

You'll need to make a POST call to https://dev-sxmg408nwnse05ju.us.auth0.com/oauth/token
In the Body of the request, you should put (filling in the client_id and client_secret with your credentials):

```
{
  "client_id": "",
  "client_secret": "",
  "audience": "https://spsfakebankaccounts.com/api",
  "grant_type": "client_credentials"
}

```

This will have a response like this:

```
{
    "access_token": "<access_token_from_auth0>",
    "expires_in": 86400,
    "token_type": "Bearer"
}
```

Then, in the requests you make, you'll have the following Header:

```
Authorization: Bearer <access_token_from_auth0>
```

## Usage

Once the server is up and running, you can use an API client like Postman to interact with the endpoints. The API supports the following operations:

- Creating an account holder
- Getting all account holders
- Getting an account holder by ID
- Updating an account holder
- Deleting an account holder
- Creating a bank account
- Getting all bank accounts
- Getting a bank account by ID
- Updating a bank account
- Closing a bank account
- Blocking a bank account
- Unblocking a bank account
- Depositing money into a bank account
- Withdrawing money from a bank account

## API Documentation

The API documentation is available in the OpenAPI format and can be found in the ./openapi/openapi.yml file.

You can access it on http://localhost:3000/api-docs (You need to put the Authorization Header on the Browser to access the documentation directly)
