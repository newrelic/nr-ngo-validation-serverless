import { APIGatewayProxyEvent } from 'aws-lambda';
import { Context } from 'aws-lambda/handler';
import { ValidationAttempts } from '../types/database';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { Logger } from '../utils/logger';
import { getValidationAttempts, getValidationAttemptsBySearchPhrase } from '../utils/database';

export const getValidationHistory = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const params = event.queryStringParameters || {};
  let accountId: string;
  let searchPhrase: string;
  let orderBy: string;
  let orderAsc: boolean;
  let limit: number;
  let offset: number;
  let validationHistory: ValidationAttempts;

  if (params.searchPhrase && params.accountId) {
    return LambdaResponses.badRequest;
  }

  if (params.searchPhrase) {
    searchPhrase = params.searchPhrase;
  }

  if (params.orderBy && params.orderAsc && params.limit && params.offset) {
    orderBy = params.orderBy;
    orderAsc = !!params.orderAsc;
    limit = Number(params.limit);
    offset = Number(params.offset);
  } else {
    return LambdaResponses.badRequest;
  }

  if (params.accountId) {
    logger.info('Getting validation history with account id');
    validationHistory = await getValidationAttempts(accountId, orderBy, orderAsc, limit, offset);
  } else {
    logger.info('There is no account id, getting all');
    validationHistory = await getValidationAttemptsBySearchPhrase(searchPhrase, orderBy, orderAsc, limit, offset);
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(validationHistory),
  };
};
