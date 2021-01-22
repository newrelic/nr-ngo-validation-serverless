import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { DatabaseContext, ValidationAttempts } from '../types/database';
import { config } from '../config';
import { getValidationAttemptByToken } from '../utils/database';
import DataApiClient from 'data-api-client';
import { LambdaResponses } from '../utils/lambda-responses';

const databaseContext: DatabaseContext = {
  resourceArn: config.DATABASE_RESOURCE_ARN,
  secretArn: config.DATABASE_SECRET_ARN,
  database: config.DATABASE,
};

const data = DataApiClient(databaseContext);

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
    return LambdaResponses.missingRequiredData;
  }

  const checkUsedTokenResult: ValidationAttempts = await getValidationAttemptByToken(data, token);

  if (checkUsedTokenResult.records.length > 0) {
    return LambdaResponses.tokenAlreadyUsed;
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(true),
  };
};
