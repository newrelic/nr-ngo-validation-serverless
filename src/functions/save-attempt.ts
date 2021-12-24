import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { LambdaResponse } from "../types/response";
import { SaveAttemptBody } from "../types/database";
import { saveValidationAttempt } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";
import { checker } from "../utils/cors-helper";
import { StatusCodes } from "http-status-codes";

/**
 * Saves provided data to database.
 *
 * @param event Incoming event from API Gateway
 */
export const saveAttempt = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const body = JSON.parse(event.body);
  const attempt = body as SaveAttemptBody;
  let origin = undefined;
  if (event.headers.origin) {
    origin = [event.headers.origin];
  } else {
    origin = [""];
  }
  let allowed = "Denied";

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed != "Denied") {
    logger.info(
      "Checking incoming parameters...",
      attempt.accountId,
      attempt.token
    );
    const { token, accountId, eligibilityStatus, orgId, orgName, reason } =
      attempt;
    if (
      token === undefined ||
      accountId === undefined ||
      eligibilityStatus === undefined ||
      orgId === undefined ||
      orgName === undefined
    ) {
      return LambdaResponses.badRequest(allowed);
    }

    logger.info("Saving data to the database...", accountId, token);
    await saveValidationAttempt(
      token,
      accountId,
      eligibilityStatus,
      orgId,
      orgName,
      reason
    );

    logger.info("Saved data...", accountId, token);

    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.CREATED,
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
