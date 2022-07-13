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
import Newrelic from "newrelic";
import { manualApprovalEvent } from "../types/nrEvents";
import { handleDistributedTracing } from "../utils/distributed_tracing";

export const manualApprove = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  return handleDistributedTracing("nr-o4g-manual-approval", async () => {
    const logger = new Logger(context);
    let origin = [""];
    const nrEvent: manualApprovalEvent = {
      func: "ManualApproval",
      accountId: "undefined",
      validationSource: "undefined",
      orgName: "undefined",
    };

    if (event.headers.origin || event.headers.Origin) {
      origin = event.headers.origin
        ? [event.headers.origin]
        : [event.headers.Origin];
    }

    let allowed = "Denied";

    logger.info("Manual approval lambda...");

    logger.info(`Origin: ${origin}`);

    if (origin.filter(checker).length > 0) {
      allowed = origin[0];
    }

    logger.info(`Allowed: ${allowed}`);

    if (allowed !== "Denied") {
      try {
        const body = JSON.parse(event.body);
        const manual = body as ManualApproval;

        nrEvent.accountId = manual.accountId ?? "undefined";
        nrEvent.validationSource = manual.validationSource ?? "undefined";
        nrEvent.orgName = manual.orgName ?? "undefined";

        logger.info(JSON.stringify(manual));

        logger.info(
          "Checking if accoount is existing already...",
          manual.accountId
        );
        const result: ValidationAttempts =
          await getValidationAttemptByAccountId(manual.accountId);

        if (result.records.length > 0) {
          Newrelic.recordCustomEvent("NrO4GManualApproval", {
            ...nrEvent,
            ...{ action: "bad_request" },
          });
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
        Newrelic.recordCustomEvent("NrO4GManualApproval", {
          ...nrEvent,
          ...{ action: "bad_request" },
        });
        logger.error("Something happend while saving the data...");
        logger.error(error.message);
        return LambdaResponses.badRequest(allowed);
      }

      Newrelic.recordCustomEvent("NrO4GManualApproval", {
        ...nrEvent,
        ...{ action: "success" },
      });

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
  });
};
