import { Context } from 'aws-lambda/handler';
import { LoggerContext } from '../types/logger';
export class Logger {
  private context: LoggerContext;

  constructor(context: Context) {
    this.context = {
      requestId: context.awsRequestId,
      function: context.functionName,
      message: '',
    };
  }

  info = (message: string): void => {
    this.context.message = message;
    console.log(this.context);
  };

  error = (message: string): void => {
    this.context.message = message;
    console.error(this.context);
  };

  warn = (message: string): void => {
    this.context.message = message;
    console.warn(this.context);
  };
}
