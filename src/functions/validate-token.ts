import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';

export const validateToken = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(''),
  };
};
