import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { ValidationAttempts } from '../types/database';

import { getValidationAttemptByAccountId } from '../utils/database';

import { LambdaResponses } from '../utils/lambda-responses';
/**
 * Checks if the provided account exists in the database and what is the status.
 *
 * @param event Incoming event from API Gateway
 */
export const validateAccount = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
  const queryStringParams = event.queryStringParameters || {};
  let accountId = '';

  if (queryStringParams.accountId) {
    accountId = queryStringParams.accountId;
  } else {
    return LambdaResponses.missingRequiredData;
  }

  const checkUsedAccountResult: ValidationAttempts = await getValidationAttemptByAccountId(accountId);

  let response = undefined;
  if (checkUsedAccountResult.records.length === 1) {
    const { eligibility_status, validation_date } = checkUsedAccountResult.records[0];
    response = {
      eligibility_status,
      validation_date,
    };
  } else {
    response = {};
  }

  // if (checkUsedAccountResult.records.length > 0) {
  //   return LambdaResponses.tokenAlreadyUsed;
  // }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
