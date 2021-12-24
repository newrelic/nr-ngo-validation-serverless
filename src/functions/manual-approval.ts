import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { ValidationAttempts } from "../types/database";
import { ManualApproval } from "../types/requests/manual-approval";
import { LambdaResponse } from "../types/response";
import { checker } from "../utils/cors-helper";
import {
  getValidationAttemptByAccountId,
  saveManualApproval,
} from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";

export const manualApprove = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  let origin = undefined;
  if (event.headers.origin) {
    origin = [event.headers.origin];
  } else {
    origin = [""];
  }
  let allowed = "Denied";

  logger.info("Manual approval lambda...");

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed != "Denied") {
    try {
      const body = JSON.parse(event.body);
      const manual = body as ManualApproval;
      logger.info(JSON.stringify(manual));

      logger.info(
        "Checking if accoount is existing already...",
        manual.accountId
      );
      const result: ValidationAttempts = await getValidationAttemptByAccountId(
        manual.accountId
      );

      if (result.records.length > 0) {
        logger.error("Account already exists in the database");
        return LambdaResponses.accountAlreadyExist(allowed);
      }

      logger.info(
        "Saving user data for manual validation...",
        manual.accountId
      );
      const manualApproved = await saveManualApproval(
        manual.accountId,
        manual.description,
        manual.validationSource,
        manual.orgName
      );
      logger.info("Saved user data...", manual.accountId);
      logger.info(manualApproved);
    } catch (error: any) {
      logger.error("Something happend while saving the data...");
      logger.error(error.message);
      return LambdaResponses.badRequest(allowed);
    }

    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(""),
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
