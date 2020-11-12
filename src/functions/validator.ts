import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { isTokenValid, isTokenExpired } from '../utils/token-validator';
import { getResponseFromLookup, getStatusFromResponse } from '../services/lookup';
import { getOrgId, getResponseFromConstraint } from '../services/constraint';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { ConstraintResponse, DataObject } from '../types/constraintResponse';
import { Status } from '../utils/status';
import { StatusCodes } from 'http-status-codes';
import { translateErrorMessages } from '../utils/error-message-translator';
import { config } from '../config';

export const validate = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
  const queryStringParams = event.queryStringParameters || {};
  let lookupResponse: LookupLargeResponse | LambdaResponses;
  let constraintResponse: ConstraintResponse;
  let response: DataObject = null;

  if (config.SESSION_KEY === '' || config.CONSTRAINT_ID === '') {
    return LambdaResponses.missingRequiredData;
  }

  // Token validation
  if (Object.keys(queryStringParams).length === 0) {
    return LambdaResponses.noTokenProvided;
  }

  if (!isTokenValid(queryStringParams.token)) {
    return LambdaResponses.badTokenProvided;
  }

  // Lookup API
  if (config.SESSION_KEY !== '') {
    lookupResponse = await getResponseFromLookup(queryStringParams.token);
  } else {
    const sessionKey = queryStringParams.session_key;
    lookupResponse = await getResponseFromLookup(queryStringParams.token, sessionKey);
  }

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

  if (config.CONSTRAINT_ID !== '') {
    constraintResponse = await getResponseFromConstraint(orgId);
  } else {
    const sessionKey = queryStringParams.session_key;
    const constraintId = queryStringParams.constraint_id;

    constraintResponse = await getResponseFromConstraint(orgId, sessionKey, constraintId);
  }

  [response] = constraintResponse.returnStatus.data;

  const errorCodes = translateErrorMessages(response.error_code as string[]);
  response.error_code = errorCodes;

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: StatusCodes.OK,
    body: JSON.stringify(response),
  };
};
