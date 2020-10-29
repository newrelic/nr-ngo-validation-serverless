import { APIGatewayEvent, Context } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { isTokenValid, isTokenExpired } from '../utils/token-validator';
import { getResponseFromLookup, getStatusFromResponse } from '../services/lookup';
import { getOrgId, getResponseFromConstraint } from '../services/constraint';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { DataObject } from '../types/constraintResponse';
import { Status } from '../utils/status';
import { StatusCodes } from 'http-status-codes';

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

  if (orgStatus !== Status.VerificationStatus.Qualified) {
    return LambdaResponses.notQualified;
  }

  // Constraing API
  const orgId = getOrgId(lookupResponse as LookupLargeResponse);
  const constraintResponse = await getResponseFromConstraint(orgId);

  [response] = constraintResponse.returnStatus.data;

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: StatusCodes.OK,
    body: JSON.stringify(response),
  };
};
