import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as core from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import path = require('path');
import { Cors } from 'aws-cdk-lib/aws-apigateway';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the DynamoDB table
    const dynamoTable = new dynamodb.Table(this, 'AddressTable', {
      partitionKey: {
        name: 'streetAddress',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Define the Lambda function
    const handler = new lambda.Function(this, 'AddressHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'get_coordinates.handler',
      code:  lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      timeout: core.Duration.seconds(10), 
      environment: {
        DYNAMODB_TABLE_NAME: dynamoTable.tableName,
      },
    });

    // Grant the Lambda function read access to the DynamoDB table
    dynamoTable.grantReadData(handler);

    const api = new apigateway.RestApi(this, 'AddressAPI', {
    // Create the API Gateway
      restApiName: 'Address API',
      defaultCorsPreflightOptions : {
        allowHeaders: [
          'Content-Type',
          'Authorization',
        ],
        allowMethods: Cors.ALL_METHODS,
        allowOrigins: Cors.ALL_ORIGINS

      }
    });

    // Define the API resource and method
    const resource = api.root.addResource('coordinates');
    const integration = new apigateway.LambdaIntegration(handler);
    resource.addMethod('GET', integration);


    // Output the API endpoint URL
    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
    });

    new cdk.CfnOutput(this, 'table', {
      value: dynamoTable.tableName,
    });
  }
}
