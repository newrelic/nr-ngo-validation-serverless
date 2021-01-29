import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { ValidationAttempts } from '../types/database';
import { getValidationAttemptByToken } from '../utils/database';
import { LambdaResponses } from '../utils/lambda-responses';

/**
 * Checks if the provided token exists in the database.
 *
 * @param event Incoming event from API Gateway
 */
export const validateToken = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
  const queryStringParams = event.queryStringParameters || {};
  let token = '';

  if (queryStringParams.token) {
    token = queryStringParams.token;
  } else {
    return LambdaResponses.badRequest;
  }

  const checkUsedTokenResult: ValidationAttempts = await getValidationAttemptByToken(token);

  if (checkUsedTokenResult.records.length > 0) {
    return LambdaResponses.tokenAlreadyUsed;
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify({ Allow: true }),
  };
};
