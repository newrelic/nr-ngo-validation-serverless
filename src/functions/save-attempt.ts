import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { LambdaResponse } from "../types/response";
import { SaveAttemptBody } from "../types/database";
import { saveValidationAttempt } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import Newrelic from "newrelic";
import { saveAttemptEvent } from "../types/nrEvents";
import { handleDistributedTracing } from "../utils/distributed_tracing";

/**
 * Saves provided data to database.
 *
 * @param event Incoming event from API Gateway
 */
export const saveAttempt = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  return handleDistributedTracing("nr-o4g-save-attempt", async () => {
    const logger = new Logger(context);
    const body = JSON.parse(event.body);
    const attempt = body as SaveAttemptBody;

    logger.info(
      "Checking incoming parameters...",
      attempt.accountId,
      attempt.token
    );
    const {
      token,
      accountId,
      eligibilityStatus,
      orgId,
      orgName,
      newrelicOrgId,
      reason,
    } = attempt;

    const nrEvent: saveAttemptEvent = {
      func: "SaveAttempt",
      accountId: attempt?.accountId ?? "undefined",
      token: attempt?.token ?? "undefined",
      eligibilityStatus: attempt?.eligibilityStatus ?? "undefined",
      orgId: attempt?.orgId ?? "undefined",
      orgName: attempt?.orgName ?? "undefined",
      newrelicOrgId: attempt?.newrelicOrgId ?? "undefined",
      reason: attempt?.reason ?? "undefined",
    };

    Newrelic.recordCustomEvent("NrO4GSaveAttempt", {
      ...nrEvent,
      ...{ action: "start" },
    });

    if (
      token === undefined ||
      accountId === undefined ||
      eligibilityStatus === undefined ||
      orgId === undefined ||
      orgName === undefined ||
      newrelicOrgId === undefined
    ) {
      Newrelic.recordCustomEvent("NrO4GSaveAttempt", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      return LambdaResponses.badRequest();
    }

    logger.info("Saving data to the database...", accountId, token);
    await saveValidationAttempt(
      token,
      accountId,
      eligibilityStatus,
      orgId,
      orgName,
      newrelicOrgId,
      reason
    );

    Newrelic.recordCustomEvent("NrO4GSaveAttempt", {
      ...nrEvent,
      ...{ action: "success" },
    });
    logger.info("Saved data...", accountId, token);

    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: StatusCodes.CREATED,
      body: "",
    };
  });
};
