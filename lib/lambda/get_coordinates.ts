import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const address = event.queryStringParameters?.address;
    const tableName = process.env.DYNAMODB_TABLE_NAME;

    if (!address || !tableName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Address parameter or table name is missing' }),
      };
    }

    const params = {
      TableName: tableName,
      FilterExpression: 'contains(streetAddress, :address)',
      ExpressionAttributeValues: {
        ':address': address,
      },
    };

    const result = await dynamoDB.scan(params).promise();

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No matching addresses found' }),
      };
    }
    const addresses = result.Items.map((item) => ({
      coordinates: {
        latitude: item.latitude,
        longitude: item.longitude,
      },
      id: item.id,
      streetName: item.streetName,
      streetAddress: item.streetAddress
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(addresses),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
