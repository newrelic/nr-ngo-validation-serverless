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

export const updateLookupLargeResponse = async (
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
  let lookupResponse: LookupLargeResponse;

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  if (allowed !== "Denied") {
    if (!params.token) {
      logger.error("No org id was given!");
      return LambdaResponses.noTokenProvided(allowed);
    }

    try {
      lookupResponse = (await getResponseFromLookup(
        params.token,
        allowed
      )) as LookupLargeResponse;
    } catch (error: any) {
      logger.error(`Cannot fetch data from TS. Details: ${error}`);
      return LambdaResponses.noDataForProvidedToken(allowed);
    }

    const orgId = getOrgId(lookupResponse as LookupLargeResponse);

    try {
      await saveLookupLargeResponse(orgId, JSON.stringify(lookupResponse));
    } catch (error: any) {
      logger.error(`Cannot save the record to the database. Error: ${error}`);
      return LambdaResponses.cannotSaveToDB(allowed);
    }

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
