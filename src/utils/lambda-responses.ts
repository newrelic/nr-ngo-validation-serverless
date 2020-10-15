import { LambdaResponse } from '../types/response';
import { StatusCodes } from 'http-status-codes';

export class LambdaResponses {
  public static readonly noTokenProvided: LambdaResponse = {
    statusCode: StatusCodes.BAD_REQUEST,
    body: JSON.stringify({ internalStatusCode: 40001, message: 'No token provided' }),
  };

  public static readonly badTokenProvided: LambdaResponse = {
    statusCode: StatusCodes.BAD_REQUEST,
    body: JSON.stringify({ internalStatusCode: 40002, message: 'Bad token provided' }),
  };

  public static readonly tokenExpired: LambdaResponse = {
    statusCode: StatusCodes.UNAUTHORIZED,
    body: JSON.stringify({ internalStatusCode: 40101, message: 'Verified - TechSoup Token expired' }),
  };

  public static readonly notQualified: LambdaResponse = {
    statusCode: StatusCodes.UNAUTHORIZED,
    body: JSON.stringify({ internalStatusCode: 40102, message: 'Sorry you do not qualified' }),
  };

  public static readonly noEndpoint: LambdaResponse = {
    statusCode: StatusCodes.NOT_FOUND,
    body: JSON.stringify({ internalStatusCode: 40401, message: 'This endpoint does not exist' }),
  };

  public static readonly noDataForProvidedToken: LambdaResponse = {
    statusCode: StatusCodes.NOT_FOUND,
    body: JSON.stringify({ internalStatusCode: 40402, message: 'No data for provided token' }),
  };
}
