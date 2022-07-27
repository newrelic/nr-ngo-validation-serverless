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
import { StatusCodes } from "http-status-codes";
import Newrelic from "newrelic";
import { validateTokenEvent } from "../types/nrEvents";
import { handleDistributedTracing } from "../utils/distributed_tracing";

/**
 * Checks if the provided token exists in the database.
 *
 * @param event Incoming event from API Gateway
 */
export const validateToken = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  return handleDistributedTracing("nr-o4g-validate-token", async () => {
    const logger = new Logger(context);
    const params = event.queryStringParameters || {};
    const nrEvent: validateTokenEvent = {
      func: "ValidateToken",
      token: params?.token ?? "undefined",
      accountId: params?.accountId ?? "undefined",
    };

    let token = "";
    let accountId = "";

    Newrelic.recordCustomEvent("NrO4GValidateToken", {
      ...nrEvent,
      ...{ action: "start" },
    });

    if (params.token && params.accountId) {
      token = params.token;
      accountId = params.accountId;
    } else {
      Newrelic.recordCustomEvent("NrO4GValidateToken", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      return LambdaResponses.badRequest();
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
      Newrelic.recordCustomEvent("NrO4GValidateToken", {
        ...nrEvent,
        ...{ action: "used_token" },
      });
      return LambdaResponses.tokenAlreadyUsed();
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
      Newrelic.recordCustomEvent("NrO4GValidateToken", {
        ...nrEvent,
        ...{ action: "token_used_recently" },
      });
      return LambdaResponses.tokenInRetentionPeriod();
    }

    logger.info("Before return value...", accountId, token);

    Newrelic.recordCustomEvent("NrO4GValidateToken", {
      ...nrEvent,
      ...{ action: "success" },
    });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ Allow: true }),
    };
  });
};
