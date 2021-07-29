import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { LambdaResponse } from '../types/response';

export const validate = async (event: APIGatewayProxyEvent, context: Context): Promise<LambdaResponse> => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: StatusCodes.OK,
    body: '',
  };
};
