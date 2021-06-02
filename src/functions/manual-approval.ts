import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { ManualApproval } from '../types/requests/manual-approval';
import { LambdaResponse } from '../types/response';
import { saveManualApproval } from '../utils/database';
import { LambdaResponses } from '../utils/lambda-responses';
import { Logger } from '../utils/logger';

export const manualApprove = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  logger.info('Manual approval lambda...');

  try {
    const body = JSON.parse(event.body);
    const manual = body as ManualApproval;
    logger.info(JSON.stringify(manual));

    logger.info('Saving user data for manual validation...');
    await saveManualApproval(manual.accountId, manual.description);
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
