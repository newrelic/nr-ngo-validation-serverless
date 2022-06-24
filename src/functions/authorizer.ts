import { Context } from "aws-lambda/handler";
import { Logger } from "../utils/logger";
import { TokenRequestEvent } from "../types/auth-request";
import {
  AuthResponse,
  AuthResponseSchema,
  Statement,
  AuthResponseStatementSchema,
} from "../types/auth-response";

export const authorize = async (
  event: TokenRequestEvent,
  context: Context
): Promise<AuthResponse> => {
  const logger = new Logger(context);
  const res: AuthResponse = AuthResponseSchema.parse({
    policyDocument: { Statement: [] },
  });
  let statement: Statement;

  if (event.authorizationToken === process.env.API_KEY) {
    statement = AuthResponseStatementSchema.parse({
      Effect: "Allow",
      Resource: event.methodArn,
    });
    logger.info(`Allow for ${JSON.stringify(event)}`);
  } else {
    statement = AuthResponseStatementSchema.parse({
      Effect: "Deny",
      Resource: event.methodArn,
    });
    logger.info(`Deny for ${JSON.stringify(event)}`);
  }

  res.policyDocument.Statement.push(statement);
  AuthResponseSchema.parse(res);
  return res;
};
