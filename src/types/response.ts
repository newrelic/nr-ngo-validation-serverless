export type LambdaResponse = {
  headers: HeaderOption;
  statusCode: number;
  body: string;
};

export type FailedResponseBody = {
  internalStatusCode: number;
  message: string;
};

export interface HeaderOption {
  'Access-Control-Allow-Origin': string;
}
