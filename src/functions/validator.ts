import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { isTokenValid, isTokenExpired } from '../utils/token-validator';
import { getResponseFromLookup, getStatusFromResponse } from '../services/lookup';
import { getOrgId, getResponseFromConstraint, getOrgName } from '../services/constraint';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { ConstraintResponse, DataObject } from '../types/constraintResponse';
import { Status } from '../utils/status';
import { StatusCodes } from 'http-status-codes';
import { translateErrorMessages } from '../utils/error-message-translator';
import { config } from '../config';
import { ResponseType } from '../types/common';

export const validate = async (event: APIGatewayProxyEvent): Promise<LambdaResponse | ConstraintResponse> => {
  const queryStringParams = event.queryStringParameters || {};
  let lookupResponse: LookupLargeResponse | LambdaResponses;
  let constraintResponse: ConstraintResponse;
  let response: DataObject = null;
  let sessionKey = '';
  let constraintId = '';

  if (config.SESSION_KEY === '') {
    if (queryStringParams.session_key) {
      sessionKey = queryStringParams.session_key;
    } else {
      return LambdaResponses.missingRequiredData;
    }
  }

  if (config.CONSTRAINT_ID === '') {
    if (queryStringParams.constraintId) {
      constraintId = queryStringParams.constraintId;
    } else {
      return LambdaResponses.missingRequiredData;
    }
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
  const orgName = getOrgName(lookupResponse as LookupLargeResponse);

  if (config.CONSTRAINT_ID !== '') {
    constraintResponse = await getResponseFromConstraint(orgId);
  } else {
    constraintResponse = await getResponseFromConstraint(orgId, sessionKey, constraintId);
  }

  if (constraintResponse.returnStatus.data.length === 0) {
    return LambdaResponses.wrongConfiguration;
  }

  if (config.RESPONSE_TYPE === ResponseType.Full.toString()) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: StatusCodes.OK,
      body: JSON.stringify(constraintResponse),
    };
  }

  [response] = constraintResponse.returnStatus.data;

  const errorCodes = translateErrorMessages(response.error_code as string[]);
  response.error_code = errorCodes;
  response.org_name = orgName;

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: StatusCodes.OK,
    body: JSON.stringify(response),
  };
};
