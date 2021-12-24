import { APIGatewayProxyEvent, Context } from "aws-lambda";
import {
  ValidationHistoryRequest,
  ValidationHistoryResponse,
  ValidationCount,
  ValidationAttempts,
} from "../types/database";
import { LambdaResponse } from "../types/response";
import { LambdaResponses } from "../utils/lambda-responses";
import { getValidationAttempts } from "../utils/database";
import { checkValidColumnName, createSql } from "../utils/sql";
import { Logger } from "../utils/logger";
import { checker } from "../utils/cors-helper";
import { StatusCodes } from "http-status-codes";

export const getValidationHistory = async (
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

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed != "Denied") {
    if (params.accountId && params.searchPhrase) {
      return LambdaResponses.badRequest(allowed);
    }

    if (!params.startDate && !params.endDate) {
      return LambdaResponses.badRequest(allowed);
    }

    logger.info("Obtaining validation history...", params.accountId);

    const validationHistoryRequest: ValidationHistoryRequest = {
      accountId: params.accountId ?? undefined,
      searchPhrase: params.searchPhrase ?? undefined,
      orderBy: params.orderBy ?? undefined,
      orderAsc: (params.orderAsc === "true" ? true : false) ?? undefined,
      limit: Number(params.limit) ?? undefined,
      offset: Number(params.offset) ?? undefined,
      startDate: new Date(params.startDate),
      endDate: new Date(params.endDate),
    };

    if (!checkValidColumnName(validationHistoryRequest.orderBy)) {
      return LambdaResponses.badRequest(allowed);
    }

    logger.info(
      "Preparing get data query and count query...",
      validationHistoryRequest.accountId
    );
    const sqlQuery = createSql(validationHistoryRequest, false);
    const countQuery = createSql(validationHistoryRequest, true);

    const validationHistory = (await getValidationAttempts(
      sqlQuery as string,
      validationHistoryRequest
    )) as ValidationAttempts;
    const recordCount = (await getValidationAttempts(
      countQuery as string,
      validationHistoryRequest
    )) as ValidationCount;

    logger.info("Return results...", validationHistoryRequest.accountId);
    logger.info(JSON.stringify(validationHistory.records));

    const response: ValidationHistoryResponse = {
      attempts: validationHistory.records,
      records:
        recordCount.records.length > 0 ? recordCount.records[0].count : 0,
    };

    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.OK,
      body: JSON.stringify(response),
    };
  }
  return {
    headers: {
      "Access-Control-Allow-Origin": allowed,
    },
    statusCode: StatusCodes.FORBIDDEN,
    body: "Access Denied.",
  };
};
