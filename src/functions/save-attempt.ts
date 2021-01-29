import { APIGatewayProxyEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { SaveAttemptBody } from '../types/database';
import { saveValidationAttempt } from '../utils/database';
import { LambdaResponses } from '../utils/lambda-responses';

/**
 * Saves provided data to database.
 *
 * @param event Incoming event from API Gateway
 */
export const saveAttempt = async (event: APIGatewayProxyEvent): Promise<LambdaResponse> => {
  const body = JSON.parse(event.body);
  const attempt = body as SaveAttemptBody;

  const { token, accountId, eligibilityStatus, orgId, orgName, reason } = attempt;
  if (
    token === undefined ||
    accountId === undefined ||
    eligibilityStatus === undefined ||
    orgId === undefined ||
    orgName === undefined
  ) {
    return LambdaResponses.badRequest;
  }

  await saveValidationAttempt(token, accountId, eligibilityStatus, orgId, orgName, reason);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: '',
  };
};
