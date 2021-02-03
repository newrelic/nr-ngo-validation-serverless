import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  ValidationHistoryRequest,
  ValidationHistoryResponse,
  ValidationCount,
  ValidationAttempts,
} from '../types/database';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { getValidationAttempts } from '../utils/database';
import { createSql } from '../utils/sql';

export const getValidationHistory = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  const params = event.queryStringParameters || {};

  if (params.accountId && params.searchPhrase) {
    return LambdaResponses.badRequest;
  }

  if (!params.startDate && !params.endDate) {
    return LambdaResponses.badRequest;
  }

  const validationHistoryRequest: ValidationHistoryRequest = {
    accountId: params.accountId ?? undefined,
    searchPhrase: params.searchPhrase ?? undefined,
    orderBy: params.orderBy ?? undefined,
    orderAsc: !!params.orderAsc ?? undefined,
    limit: Number(params.limit) ?? undefined,
    offset: Number(params.offset) ?? undefined,
    startDate: new Date(params.startDate),
    endDate: new Date(params.endDate),
  };

  const sqlQuery = createSql(validationHistoryRequest, false);
  const countQuery = createSql(validationHistoryRequest, true);

  const validationHistory = (await getValidationAttempts(
    sqlQuery as string,
    validationHistoryRequest,
  )) as ValidationAttempts;
  const recordCount = (await getValidationAttempts(countQuery as string, validationHistoryRequest)) as ValidationCount;

  const response: ValidationHistoryResponse = {
    attempts: validationHistory.records,
    records: recordCount.records[0].count ?? 0,
  };

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
