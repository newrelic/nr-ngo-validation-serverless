import { Context } from 'aws-lambda/handler';
import { LoggerContext } from '../types/logger';
export class Logger {
  private context: LoggerContext;

  constructor(context: Context) {
    this.context = {
      requestId: context.awsRequestId,
      function: context.functionName,
      message: '',
      accountId: '',
      token: '',
    };
  }

  info = (message: string, accountId?: string, token?: string): void => {
    this.context.message = message;
    this.context.accountId = accountId;
    this.context.token = token;

    console.log(this.context);
  };

  error = (message: string, accountId?: string, token?: string): void => {
    this.context.message = message;
    this.context.accountId = accountId;
    this.context.token = token;

    console.error(this.context);
  };

  warn = (message: string, accountId?: string, token?: string): void => {
    this.context.message = message;
    this.context.accountId = accountId;
    this.context.token = token;

    console.warn(this.context);
  };
}
