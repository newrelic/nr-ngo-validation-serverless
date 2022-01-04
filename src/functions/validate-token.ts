import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { LambdaResponse } from "../types/response";
import {
  TokenAndAccountId,
  ValidationAttempts,
  ValidationCount,
} from "../types/database";
import {
  getValidationAttemptByToken,
  checkValidationDate,
} from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";
import { checker } from "../utils/cors-helper";
import { StatusCodes } from "http-status-codes";

/**
 * Checks if the provided token exists in the database.
 *
 * @param event Incoming event from API Gateway
 */
export const validateToken = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const params = event.queryStringParameters || {};
  let origin = undefined;

  if (event.headers.origin) {
    origin = [event.headers.origin];
  } else {
    origin = [""];
  }

  let allowed = "Denied";
  let token = "";
  let accountId = "";

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed !== "Denied") {
    if (params.token && params.accountId) {
      token = params.token;
      accountId = params.accountId;
    } else {
      return LambdaResponses.badRequest(allowed);
    }

    logger.info(
      "Incoming request to validate token lambda...",
      accountId,
      token
    );

    const data: TokenAndAccountId = {
      token: token,
      accountId: accountId,
    };

    const checkUsedTokenResult: ValidationAttempts =
      await getValidationAttemptByToken(token);
    logger.info(
      `Token Result: ${JSON.stringify(checkUsedTokenResult)}`,
      accountId,
      token
    );

    if (checkUsedTokenResult.records.length > 0) {
      return LambdaResponses.tokenAlreadyUsed(allowed);
    }

    const tokenRetention: ValidationCount = await checkValidationDate(
      data.token,
      data.accountId
    );
    logger.info(
      `Token Retention: ${JSON.stringify(tokenRetention)}`,
      accountId,
      token
    );

    if (tokenRetention.records[0].count > 0) {
      return LambdaResponses.tokenInRetentionPeriod(allowed);
    }

    logger.info("Before return value...", accountId, token);

    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ Allow: true }),
    };
  } else {
    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.FORBIDDEN,
      body: "Access Denied.",
    };
  }
};
