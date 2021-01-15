import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { ValidationAttemptsModel } from '../model/validation-attempts';
import { isTokenValid } from '../utils/token-validator';
import { LambdaResponses } from '../utils/lambda-responses';

/**
 * Checks if the provided token exists in the database.
 *
 * @param event Incoming event from API Gateway
 */
export const validateToken = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
  const params = event.queryStringParameters || {};

  if (!isTokenValid(params.token)) {
    return LambdaResponses.badTokenProvided;
  }

  if (!params.account_id) {
    return LambdaResponses.missingRequiredData;
  }

  const queryItem = await ValidationAttemptsModel.query('account_id').eq(params.account_id).exec();

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(queryItem),
  };
};
