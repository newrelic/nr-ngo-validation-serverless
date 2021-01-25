import { Context } from 'aws-lambda/handler';

export class Logger {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  public info(message: string, context: string) {
    throw new Error('Not implemented yet...');
  }

  public error(message: string, context: string) {
    throw new Error('Not implemented yet...');
  }

  public warn(message: string, context: string) {
    throw new Error('Not implemented yet...');
  }
}
