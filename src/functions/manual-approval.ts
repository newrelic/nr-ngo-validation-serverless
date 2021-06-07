import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { ValidationAttempts } from '../types/database';
import { ManualApproval } from '../types/requests/manual-approval';
import { LambdaResponse } from '../types/response';
import { getValidationAttemptByAccountId, saveManualApproval } from '../utils/database';
import { LambdaResponses } from '../utils/lambda-responses';
import { Logger } from '../utils/logger';

export const manualApprove = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  logger.info('Manual approval lambda...');

  try {
    const body = JSON.parse(event.body);
    const manual = body as ManualApproval;
    logger.info(JSON.stringify(manual));

    logger.info('Checking if accoount is existing already...');
    const result: ValidationAttempts = await getValidationAttemptByAccountId(manual.accountId);

    if (result.records.length > 0) {
      return LambdaResponses.accountAlreadyExist;
    }

    logger.info('Saving user data for manual validation...');
    await saveManualApproval(manual.accountId, manual.description, manual.validationSource);
    logger.info('Saved user data...');
  } catch (error) {
    logger.error('Something happend while saving the data...');
    return LambdaResponses.badRequest;
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 201,
    body: JSON.stringify(''),
  };
};
