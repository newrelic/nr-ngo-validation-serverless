import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { getOrgId } from "../services/constraint";
import { getResponseFromLookup } from "../services/lookup";
import { LookupLargeResponse } from "../types/lookupLargeResponse";
import { LambdaResponse } from "../types/response";
import { checker } from "../utils/cors-helper";
import { saveLookupLargeResponse } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";
import Newrelic from "newrelic";
import { updateLlrEvent } from "../types/nrEvents";

export const updateLookupLargeResponse = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const params = event.queryStringParameters || {};
  let origin = [""];
  const nrEvent: updateLlrEvent = {
    func: "UpdateLLR",
    token: params?.token ?? "undefined",
  };

  Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
    ...nrEvent,
    ...{ action: "start" },
  });

  if (event.headers.origin || event.headers.Origin) {
    origin = event.headers.origin
      ? [event.headers.origin]
      : [event.headers.Origin];
  }

  let allowed = "Denied";
  let lookupResponse: LookupLargeResponse;

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = origin[0];
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed !== "Denied") {
    if (!params.token) {
      Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      logger.error("No org id was given!");
      return LambdaResponses.noTokenProvided(allowed);
    }

    try {
      lookupResponse = (await getResponseFromLookup(
        params.token,
        allowed
      )) as LookupLargeResponse;
    } catch (error: any) {
      Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
        ...nrEvent,
        ...{ action: "no_data_for_token" },
      });
      logger.error(`Cannot fetch data from TS. Details: ${error}`);
      return LambdaResponses.noDataForProvidedToken(allowed);
    }

    const orgId = getOrgId(lookupResponse as LookupLargeResponse);

    try {
      await saveLookupLargeResponse(orgId, JSON.stringify(lookupResponse));
    } catch (error: any) {
      Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
        ...nrEvent,
        ...{ action: "cannot_save_to_db" },
      });
      logger.error(`Cannot save the record to the database. Error: ${error}`);
      return LambdaResponses.cannotSaveToDB(allowed);
    }

    Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
      ...nrEvent,
      ...{ action: "success" },
    });

    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.CREATED,
      body: "",
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
