import { APIGatewayProxyEvent } from 'aws-lambda';
import { Context } from 'aws-lambda/handler';
import { ValidationAttempts } from '../types/database';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { Logger } from '../utils/logger';
import { getAllValidationAttempts, getValidationAttempts } from '../utils/database';

export const getValidationHistory = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const params = event.queryStringParameters || {};
  let accountId: number;
  let orderBy: string;
  let orderByDirection: boolean;
  let limit: number;
  let offset: number;
  let validationHistory: ValidationAttempts;

  if (params.orderBy && params.orderByDirection && params.limit && params.offset) {
    orderBy = params.orderBy;
    orderByDirection = !!params.orderByDirection;
    limit = Number(params.limit);
    offset = Number(params.offset);
  } else {
    return LambdaResponses.missingRequiredData;
  }

  if (params.accountId) {
    accountId = Number(params.accountId);

    logger.info('Getting validation history with account id');
    validationHistory = await getValidationAttempts(accountId, orderBy, orderByDirection, limit, offset);
  } else {
    logger.info('There is no account id, getting all');
    validationHistory = await getAllValidationAttempts(orderBy, orderByDirection, limit, offset);
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(validationHistory),
  };
};
