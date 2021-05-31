import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from '../utils/lambda-responses';
import { Logger } from '../utils/logger';

export const manualApprove = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  logger.info('Manual approval lambda...');

  const body = JSON.parse(event.body);

  // accountId, validationSource, description

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(''),
  };
};
