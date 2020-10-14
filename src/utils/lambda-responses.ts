import { LambdaResponse } from '../types/response';
import { Status } from '../utils/status';

export class LambdaResponses {
  public static readonly noTokenProvided: LambdaResponse = {
    statusCode: Status.HttpStatus.BadRequest,
    body: JSON.stringify({ internalStatusCode: 40001, message: 'No token provided' }),
  };

  public static readonly badTokenProvided: LambdaResponse = {
    statusCode: Status.HttpStatus.BadRequest,
    body: JSON.stringify({ internalStatusCode: 40002, message: 'Bad token provided' }),
  };

  public static readonly tokenExpired: LambdaResponse = {
    statusCode: Status.HttpStatus.Unauthorized,
    body: JSON.stringify({ internalStatusCode: 40101, message: 'Verified - TechSoup Token expired' }),
  };

  public static readonly notQualified: LambdaResponse = {
    statusCode: Status.HttpStatus.Unauthorized,
    body: JSON.stringify({ internalStatusCode: 40102, message: 'Sorry you do not qualified' }),
  };

  public static readonly noEndpoint: LambdaResponse = {
    statusCode: Status.HttpStatus.NotFound,
    body: JSON.stringify({ internalStatusCode: 40401, message: 'This endpoint does not exist' }),
  };

  public static readonly noDataForProvidedToken: LambdaResponse = {
    statusCode: Status.HttpStatus.NotFound,
    body: JSON.stringify({ internalStatusCode: 40402, message: 'No data for provided token' }),
  };
}
