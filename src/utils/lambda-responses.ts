import { LambdaResponse } from '../types/response';

export class LambdaResponses {
  public static readonly noTokenProvided: LambdaResponse = {
    statusCode: 400,
    body: JSON.stringify({ message: 'No token provided' }, null, 2),
  };

  public static readonly badTokenProvided: LambdaResponse = {
    statusCode: 400,
    body: JSON.stringify({ message: 'Bad token provided' }, null, 2),
  };

  public static readonly noDataForProvidedToken: LambdaResponse = {
    statusCode: 404,
    body: JSON.stringify({ message: 'No data for provided token' }, null, 2),
  };

  public static readonly noEndpoint: LambdaResponse = {
    statusCode: 404,
    body: JSON.stringify({ message: 'This endpoint does not exist' }, null, 2),
  };

  public static readonly tokenExpired: LambdaResponse = {
    statusCode: 401,
    body: JSON.stringify(
      { message: 'Verified - TechSoup Token expired' },
      null,
      2,
    ),
  };

  public static readonly notQualified: LambdaResponse = {
    statusCode: 401,
    body: JSON.stringify({ message: "Sorry you don't qualified. " }, null, 2),
  };
}
