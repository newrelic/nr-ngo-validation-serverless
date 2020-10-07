import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { isTokenValid, isTokenExpired } from '../utils/token-validator';
import {
  getResponseFromLookup,
  getStatusFromResponse,
} from '../services/lookup';
import { getOrgId, getResponseFromConstraint } from '../services/constraint';
import { LookupLargeResponse } from '../types/lookupLargeResponse';

const QUALIFIED = 1;

export const validate: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context,
): Promise<LambdaResponse> => {
  const queryStringParams = event.queryStringParameters || {};

  // TODO: Handle sending request with pin and handle (check the excel)

  // Token validation
  if (Object.keys(queryStringParams).length === 0) {
    return LambdaResponses.noTokenProvided;
  }

  if (!isTokenValid(queryStringParams.token)) {
    return LambdaResponses.badTokenProvided;
  }

  // Lookup API
  const lookupResponse = await getResponseFromLookup(queryStringParams.token);

  console.log(`Data: ${JSON.stringify(lookupResponse, null, 2)}`);

  if (lookupResponse === LambdaResponses.noDataForProvidedToken) {
    return lookupResponse as LambdaResponse;
  }

  if (
    isTokenExpired(
      queryStringParams.token,
      lookupResponse as LookupLargeResponse,
    )
  ) {
    return LambdaResponses.tokenExpired;
  }

  const orgStatus = getStatusFromResponse(
    lookupResponse as LookupLargeResponse,
  );

  if (orgStatus !== QUALIFIED) {
    return LambdaResponses.notQualified;
  }

  // Constraing API
  const orgId = getOrgId(lookupResponse as LookupLargeResponse);
  const constraintResponse = await getResponseFromConstraint(orgId);

  console.log(JSON.stringify(constraintResponse, null, 2));

  // TODO: check what is the value of eligibility_status and which error code was returned

  // TODO: create frontend-backend contract and convert response
  return {
    statusCode: 200,
    body: JSON.stringify(
      { data: constraintResponse.returnStatus.data },
      null,
      2,
    ),
  };
};
