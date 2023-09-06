import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const client = new DynamoDBClient({ region: 'us-west-2' });
  const docClient = DynamoDBDocumentClient.from(client);

  try {
    console.log('making a post request -------------------------------');
    const parsedBody = JSON.parse(event.body || '');
    const command = new PutCommand({
      TableName: 'jobs',
      Item: {
        id: uuidv4(),
        firstName: `${parsedBody?.name}`,
      },
    });
    await docClient.send(command);
    return {
      statusCode: 200,
      body: `Goodbye ${parsedBody?.name} :)`,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'An error occured',
    };
  }
};
