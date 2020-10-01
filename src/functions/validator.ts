import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import { sendGetRequest } from '../utils/http-util';
import { createLookupApiUrl, createConstraintApiUrl } from '../utils/http-util';
import { config } from '../config';
import { LambdaResponse } from '../types/response';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { ConstraintResponse } from '../types/constraintResponse';
import { LambdaResponses } from '../utils/lambda-responses';
import { validateLookupResponse, isTokenValid } from '../utils/token-validator';

export const validate: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context,
): Promise<LambdaResponse> => {
  const queryStringParams = event.queryStringParameters || {};

  // TODO: Handle sending request with pin and handle (check the excel)

  if (Object.keys(queryStringParams).length === 0) {
    return LambdaResponses.noTokenProvided;
  }

  if (!isTokenValid(queryStringParams.token)) {
    return LambdaResponses.badTokenProvided;
  }

  const lookUpApiUrl = createLookupApiUrl(
    config.LOOKUP_API_URL,
    queryStringParams.token,
  );

  const lookupRes = await sendGetRequest<LookupLargeResponse>(lookUpApiUrl);

  // TODO: Validate token expiration date

  const validatedLookupResponse = validateLookupResponse(lookupRes);
  if (validatedLookupResponse === LambdaResponses.noDataForProvidedToken) {
    return validatedLookupResponse;
  }

  const orgId = (validatedLookupResponse as LookupLargeResponse).returnStatus
    .data[0].org_id;
  const constraintApiUrl = createConstraintApiUrl(
    config.CONSTRAINT_API_URL,
    orgId,
  );

  const constraintRes = await sendGetRequest<ConstraintResponse>(
    constraintApiUrl,
  );

  console.log(JSON.stringify(constraintRes, null, 2));

  // TODO: check what is the value of eligibility_status and which error code was returned

  // TODO: create frontend-backend contract and convert response
  return {
    statusCode: 200,
    body: JSON.stringify(
      { data: constraintRes /* .returnStatus.data */ },
      null,
      2,
    ),
  };
};
