# Welcome to Geocoder project

Geocoder is a serverless geocoding service built on AWS that allows you to search for addresses and retrieve their corresponding coordinates. This service is powered by AWS Lambda, Amazon DynamoDB, and Amazon API Gateway.


## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Make sure you have the following installed on your system:

- npm
- Node.js
- AWS account with AWS CLI configured
- AWS CDK (Cloud Development Kit) installed (`npm install -g aws-cdk`)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kecyGaurab/geocoder.git
   ```
2. Install yarn packages
   ```sh
   npm  install
   ```

## Environment Variables

Before deploying and using the Geocoder service, make sure you have the following environment variables set:

- **AWS_REGION**: The AWS region where you want to deploy the service. For example, `us-east-1`. Ensure that your AWS CLI configuration is also set to the same region.

- **AWS_ACCESS_KEY_ID** and **AWS_SECRET_ACCESS_KEY**: Your AWS IAM user's access key ID and secret access key with appropriate permissions for creating AWS resources using AWS CDK. It's recommended to store these securely and not hardcode them in your code.

- **DYNAMODB_TABLE_NAME**: The name of the DynamoDB table where the Geocoder service will store address data and coordinates. Make sure this table name matches the one defined in your AWS CDK stack.

You can set these environment variables in various ways, such as in a `.env` file (not recommended for production) or using your preferred method for managing environment variables in your deployment environment.

**Note**: When running the `seedTable.ts` script (for seeding the database), ensure that these environment variables are also set in your environment. Additionally, make sure the AWS CLI is configured correctly, especially if you're running the CDK deployment or Lambda functions locally.

Example .env file:

```plaintext
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
DYNAMODB_TABLE_NAME=your-dynamodb-table-name
```

## Deploying the Service

1. Configure your AWS credentials using the AWS CLI:
    ```sh
    aws configure
    ```
2. Deploy the AWS CDK stack to create the necessary AWS resources (DynamoDB table, Lambda function, API Gateway):
    ```sh
    cd cdk
    npm install  # Install CDK dependencies
    cdk deploy
    ```


## Usage

Searching for Addresses
After deploying the service, you can access the API using the following endpoint:

GET https://{apiId}.execute-api.us-east-1.amazonaws.com/prod/coordinates?address=Oakley Lane 2

## Testing

You can run tests for your Lambda function by using a testing framework like Jest. Ensure you have Jest installed (npm install -g jest).

To run tests, execute the following command from the project root:

  ```sh
    npm test
  ```
