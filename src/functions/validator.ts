import { APIGatewayEvent, Context } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { isTokenValid, isTokenExpired } from '../utils/token-validator';
import { getResponseFromLookup, getStatusFromResponse } from '../services/lookup';
import { getOrgId, getResponseFromConstraint } from '../services/constraint';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { DataObject } from '../types/constraintResponse';

const QUALIFIED = 1;
const OK = 200;

export const validate = async (event: APIGatewayEvent, _context: Context): Promise<LambdaResponse> => {
  const queryStringParams = event.queryStringParameters || {};
  let response: DataObject = null;

  // Token validation
  if (Object.keys(queryStringParams).length === 0) {
    return LambdaResponses.noTokenProvided;
  }

  if (!isTokenValid(queryStringParams.token)) {
    return LambdaResponses.badTokenProvided;
  }

  // Lookup API
  const lookupResponse = await getResponseFromLookup(queryStringParams.token);

  if (lookupResponse === LambdaResponses.noDataForProvidedToken) {
    return lookupResponse as LambdaResponse;
  }

  if (isTokenExpired(queryStringParams.token, lookupResponse as LookupLargeResponse)) {
    return LambdaResponses.tokenExpired;
  }

  const orgStatus = getStatusFromResponse(lookupResponse as LookupLargeResponse);

  if (orgStatus !== QUALIFIED) {
    return LambdaResponses.notQualified;
  }

  // Constraing API
  const orgId = getOrgId(lookupResponse as LookupLargeResponse);
  const constraintResponse = await getResponseFromConstraint(orgId);

  console.log(JSON.stringify(constraintResponse, null, 2));

  // TODO: check what is the value of eligibility_status and which error code was returned
  [response] = constraintResponse.returnStatus.data;

  // TODO: create frontend-backend contract and convert response
  return {
    statusCode: OK,
    body: JSON.stringify(response),
  };
};
