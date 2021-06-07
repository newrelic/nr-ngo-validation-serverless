import { APIGatewayProxyEvent, Context } from 'aws-lambda';
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
import { Logger } from '../utils/logger';
import { checkIfOrgIdExist } from '../utils/database';
import { ValidationAttempts } from '../types/database';

export const validate = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<LambdaResponse | ConstraintResponse> => {
  const logger = new Logger(context);
  const queryStringParams = event.queryStringParameters || {};
  let lookupResponse: LookupLargeResponse | LambdaResponses;
  let constraintResponse: ConstraintResponse;
  let response: DataObject = null;
  let sessionKey = '';
  let constraintId = '';

  logger.info('Checking incoming request from the platform...');
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

  logger.info('Starting token validation...');
  // Token validation
  if (Object.keys(queryStringParams).length === 0) {
    return LambdaResponses.noTokenProvided;
  }

  if (!isTokenValid(queryStringParams.token)) {
    return LambdaResponses.badTokenProvided;
  }

  logger.info('Sending request to Lookup API...', '', queryStringParams.token);
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

  logger.info('Sending request to Constraint API...', '', queryStringParams.token);
  // Constraing API
  const orgId = getOrgId(lookupResponse as LookupLargeResponse);
  const orgName = getOrgName(lookupResponse as LookupLargeResponse);

  logger.info('Checking if organisation already exists and is elibile...');
  const result: ValidationAttempts = await checkIfOrgIdExist(orgId);

  if (result.records.length > 0) {
    return LambdaResponses.organisationAlreadyExist;
  }

  if (config.CONSTRAINT_ID !== '') {
    constraintResponse = await getResponseFromConstraint(orgId);
  } else {
    constraintResponse = await getResponseFromConstraint(orgId, sessionKey, constraintId);
  }

  if (constraintResponse.returnStatus.data.length === 0) {
    return LambdaResponses.wrongConfiguration;
  }

  if (config.RESPONSE_TYPE === ResponseType.Full.toString()) {
    logger.info('Returning basic response from constraint API');

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: StatusCodes.OK,
      body: JSON.stringify(constraintResponse),
    };
  }

  [response] = constraintResponse.returnStatus.data;

  logger.info('Translating error messages');
  const errorCodes = translateErrorMessages(response.error_code as string[]);
  response.error_code = errorCodes;
  response.org_name = orgName;

  logger.info('Returning the response');
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: StatusCodes.OK,
    body: JSON.stringify(response),
  };
};
