import { Context } from 'aws-lambda/handler';

export class Logger {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  info = (message: string): void => {
    console.log({
      requestId: this.context.awsRequestId,
      message: message,
      function: this.context.functionName,
    });
  };

  error = (message: string): void => {
    console.error({
      requestId: this.context.awsRequestId,
      message: message,
      function: this.context.functionName,
    });
  };

  warn = (message: string): void => {
    console.warn({
      requestId: this.context.awsRequestId,
      message: message,
      function: this.context.functionName,
    });
  };
}
