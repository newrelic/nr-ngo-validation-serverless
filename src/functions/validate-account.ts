import { APIGatewayProxyEvent } from "aws-lambda";
import { LambdaResponse } from "../types/response";
import { ValidationAttempts } from "../types/database";
import { getValidationAttemptByAccountId } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Context } from "aws-lambda/handler";
import { Logger } from "../utils/logger";
import { checker } from "../utils/cors-helper";
import { StatusCodes } from "http-status-codes";

/**
 * Checks if the provided account exists in the database and what is the status.
 *
 * @param event Incoming event from API Gateway
 */
export const validateAccount = async (
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
  let accountId: string;

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed !== "Denied") {
    if (params.accountId) {
      accountId = params.accountId;
    } else {
      return LambdaResponses.badRequest(allowed);
    }

    logger.info("Getting information about account from database", accountId);
    const checkUsedAccountResult: ValidationAttempts =
      await getValidationAttemptByAccountId(accountId);
    logger.info("Obtained information about account", accountId);

    let response = undefined;
    if (checkUsedAccountResult.records.length === 1) {
      const { eligibility_status, validation_date } =
        checkUsedAccountResult.records[0];
      response = {
        eligibility_status,
        validation_date,
      };
      logger.info("Found the account", accountId);
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.OK,
        body: JSON.stringify(response),
      };
    }

    logger.info("Account not found", accountId);
    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.NO_CONTENT,
      body: "",
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
