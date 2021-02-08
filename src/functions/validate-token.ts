import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { TokenAndAccountId, ValidationAttempts } from '../types/database';
import { getValidationAttemptByToken, checkValidationDate } from '../utils/database';
import { LambdaResponses } from '../utils/lambda-responses';

/**
 * Checks if the provided token exists in the database.
 *
 * @param event Incoming event from API Gateway
 */
export const validateToken = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
  const params = event.queryStringParameters || {};
  let token = '';

  if (params.token) {
    token = params.token;
  } else {
    return LambdaResponses.badRequest;
  }

  const data: TokenAndAccountId = {
    token: token,
    accountId: params.accountId ?? undefined,
  };

  const checkUsedTokenResult: ValidationAttempts = await getValidationAttemptByToken(token);

  if (checkUsedTokenResult.records.length > 0) {
    return LambdaResponses.tokenAlreadyUsed;
  }

  const tokenRetention: ValidationAttempts = await checkValidationDate(data.token, data.accountId);

  if (tokenRetention.records.length === 0) {
    return LambdaResponses.tokenInRetentionPeriod;
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify({ Allow: true }),
  };
};
