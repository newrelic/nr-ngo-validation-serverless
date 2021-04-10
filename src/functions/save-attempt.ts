import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { SaveAttemptBody } from '../types/database';
import { saveValidationAttempt } from '../utils/database';
import { LambdaResponses } from '../utils/lambda-responses';
import { Logger } from '../utils/logger';

/**
 * Saves provided data to database.
 *
 * @param event Incoming event from API Gateway
 */
export const saveAttempt = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const body = JSON.parse(event.body);
  const attempt = body as SaveAttemptBody;

  logger.info('Checking incoming parameters...');
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

  logger.info('Saving data to the database...');
  await saveValidationAttempt(token, accountId, eligibilityStatus, orgId, orgName, reason);

  logger.info('Saved data...', accountId, token);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 201,
    body: '',
  };
};
