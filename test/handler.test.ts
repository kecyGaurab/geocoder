import { handler } from '../lib/lambda/get_coordinates'; 
import { APIGatewayProxyEvent } from 'aws-lambda';

let event: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/",
  pathParameters: null,
  queryStringParameters: {
  },
  stageVariables: null,
  requestContext: {
    accountId: "mockAccountId",
    apiId: "mockApiId",
    authorizer: null,
    domainName: "mockDomainName",
    domainPrefix: "mockDomainPrefix",
    extendedRequestId: "mockExtendedRequestId",
    httpMethod: "GET",
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: "127.0.0.1",
      user: null,
      userAgent: null,
      userArn: null,
    },
    path: "/coordinates",
    protocol: "HTTP/1.1",
    requestId: "mockRequestId",
    requestTime: "mockRequestTime",
    requestTimeEpoch: 1234567890,
    resourceId: "mockResourceId",
    resourcePath: "/test",
    stage: "mockStage",
  },
  multiValueQueryStringParameters: null,
  resource: "",
};


describe('Lambda Function', () => {
  it('should return a 200 status code and valid response', async () => {

    const mockEvent = {
      ...event,
      queryStringParameters: {
        address:'Elmo Street 2',
      },
    }
    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();

  })

  it('should return a 200 status code and matching addresses', async () => {
    const mockEvent = {
      ...event,
      queryStringParameters: {
        address: 'Elm', // Partial address for the test
      },
    };

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    const responseBody = JSON.parse(response.body);
    expect(responseBody.length).toBeGreaterThan(1); 

  })

  it('should handle missing address parameter', async () => {
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toContain('Address parameter or table name is missing');
  });

});
