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

  const lookUpApiUrl = createLookupApiUrl(
    config.LOOKUP_API_URL,
    event.queryStringParameters['token']
  );
  const lookupRes = await sendGetRequestToLookup(lookUpApiUrl);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: lookupRes }, null, 2),
  };
};
