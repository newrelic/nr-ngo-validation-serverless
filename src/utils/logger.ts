import { Context } from 'aws-lambda/handler';

export class Logger {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  info = (message: string, context: string): void => {
    throw new Error('Not implemented yet...');
  };

  error = (message: string, context: string): void => {
    throw new Error('Not implemented yet...');
  };

  warn = (message: string, context: string): void => {
    throw new Error('Not implemented yet...');
  };
}
