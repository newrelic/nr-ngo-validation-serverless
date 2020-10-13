import { LambdaResponse } from '../types/response';

export class LambdaResponses {
  public static readonly noTokenProvided: LambdaResponse = {
    statusCode: 400,
    body: JSON.stringify({ internalStatusCode: 40001, message: 'No token provided' }),
  };

  public static readonly badTokenProvided: LambdaResponse = {
    statusCode: 400,
    body: JSON.stringify({ internalStatusCode: 40002, message: 'Bad token provided' }),
  };

  public static readonly tokenExpired: LambdaResponse = {
    statusCode: 401,
    body: JSON.stringify({ internalStatusCode: 40101, message: 'Verified - TechSoup Token expired' }),
  };

  public static readonly notQualified: LambdaResponse = {
    statusCode: 401,
    body: JSON.stringify({ internalStatusCode: 40102, message: 'Sorry you do not qualified' }),
  };

  public static readonly noEndpoint: LambdaResponse = {
    statusCode: 404,
    body: JSON.stringify({ internalStatusCode: 40401, message: 'This endpoint does not exist' }),
  };

  public static readonly noDataForProvidedToken: LambdaResponse = {
    statusCode: 404,
    body: JSON.stringify({ internalStatusCode: 40402, message: 'No data for provided token' }),
  };
}
