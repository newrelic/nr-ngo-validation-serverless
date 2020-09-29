import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import { sendGetRequestToLookup } from '../utils/http-util';
import { createLookupApiUrl } from '../utils/http-util';
import { config } from '../config';
import { LambdaResponse } from '../types/response';

export const validate: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<LambdaResponse> => {
  // eslint-disable-next-line no-console
  console.log(_context);
  const queryStringParams = event.queryStringParameters || {};

  if (Object.keys(queryStringParams).length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify(
        { message: 'Cannot return content if token is not provided' },
        null,
        2
      ),
    };
  }

  console.log(`Tuken: ${queryStringParams.token}`);

  const lookUpApiUrl = createLookupApiUrl(
    config.LOOKUP_API_URL,
    queryStringParams.token
  );
  const lookupRes = await sendGetRequestToLookup(lookUpApiUrl);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: lookupRes }, null, 2),
  };
};
