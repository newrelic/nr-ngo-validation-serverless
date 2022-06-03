import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { LookupLargeResponse, LookupLargeResponses } from "../types/database";
import { LambdaResponse } from "../types/response";
import { getLookupLargeResponse } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";
import { checker } from "../utils/cors-helper";
import Newrelic from "newrelic";
import { getLlrEvent } from "../types/nrEvents";

export const getLookupResponse = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const params = event.queryStringParameters || {};
  let origin = [""];
  const nrEvent: getLlrEvent = {
    func: "getLLR",
    orgId: params.orgId ?? "undefined",
  };

  if (event.headers.origin || event.headers.Origin) {
    origin = event.headers.origin
      ? [event.headers.origin]
      : [event.headers.Origin];
  }

  let allowed = "Denied";

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed !== "Denied") {
    if (!params.orgId) {
      Newrelic.recordCustomEvent("NrO4GLookupResponse", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      logger.error("No org id was given!");
      return LambdaResponses.badRequest(allowed);
    }

    Newrelic.recordCustomEvent("NrO4GLookupResponse", {
      ...nrEvent,
      ...{ action: "start" },
    });

    logger.info(
      `Getting lookup large response from database for given orgid: ${params.orgId}...`
    );

    const response: LookupLargeResponses = await getLookupLargeResponse(
      params.orgId
    );

    if (response.records.length === 0) {
      logger.error("There is no data for given orgId!");
      return LambdaResponses.noDataForProvidedOrgId(allowed);
    }

    logger.info(`Return object for orgId = ${params.orgId}`);
    const data: LookupLargeResponse = response.records[0];

    logger.info("Parsing data from llr...");
    const result = JSON.parse(data.response);

    Newrelic.recordCustomEvent("NrO4GLookupResponse", {
      ...nrEvent,
      ...{ action: "success" },
    });
    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.OK,
      body: JSON.stringify(result),
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
