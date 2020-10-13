export type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type FailedResponseBody = {
  internalStatusCode: number;
  message: string;
};
