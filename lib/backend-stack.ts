import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the DynamoDB table
    const dynamoTable = new dynamodb.Table(this, 'AddressTable', {
      partitionKey: {
        name: 'addressId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, 
      removalPolicy: cdk.RemovalPolicy.DESTROY, 
    });

    // Add a Global Secondary Index (GSI) for coordinates
    dynamoTable.addGlobalSecondaryIndex({
      indexName: 'CoordinatesIndex',
      partitionKey: {
        name: 'latitude',
        type: dynamodb.AttributeType.NUMBER,
      },
      sortKey: {
        name: 'longitude',
        type: dynamodb.AttributeType.NUMBER,
      },
    });
  }
}
