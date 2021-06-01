import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { ManualApprovalRequest, manualApprovalSchema } from '../types/requests/manual-approval';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { Logger } from '../utils/logger';

export const manualApprove = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  logger.info('Manual approval lambda...');

  try {
    const data: ManualApprovalRequest = manualApprovalSchema.parse(event.body);
    logger.info(JSON.stringify(data));
    logger.info('Saving user data for manual validation...');
  } catch (error) {
    return LambdaResponses.badRequest;
  }

  // accountId, validationSource, description

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(''),
  };
};
