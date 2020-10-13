import { DataObject } from '../types/constraintResponse';

export type LambdaResponse = {
  statusCode: number;
  body: CorrectResponseBody | FailedResponseBody;
};

export type CorrectResponseBody = {
  data: DataObject;
};

export type FailedResponseBody = {
  internalStatusCode: number;
  message: string;
};
