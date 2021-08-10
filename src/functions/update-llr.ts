import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { getOrgId } from "../services/constraint";
import { getResponseFromLookup } from "../services/lookup";
import { LookupLargeResponse } from "../types/lookupLargeResponse";
import { LambdaResponse } from "../types/response";
import { saveLookupLargeResponse } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";

export const updateLookupLargeResponse = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const params = event.queryStringParameters || {};
  let lookupResponse: LookupLargeResponse;

  if (!params.token) {
    logger.error("No org id was given!");
    return LambdaResponses.noTokenProvided;
  }

  try {
    lookupResponse = (await getResponseFromLookup(
      params.token
    )) as LookupLargeResponse;
  } catch (error) {
    logger.error(`Cannot fetch data from TS. Details: ${error}`);
    return LambdaResponses.noDataForProvidedToken;
  }

  const orgId = getOrgId(lookupResponse as LookupLargeResponse);

  try {
    await saveLookupLargeResponse(orgId, JSON.stringify(lookupResponse));
  } catch (error) {
    logger.error(`Cannot save the record to the database. Error: ${error}`);
    return LambdaResponses.cannotSaveToDB;
  }

  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: StatusCodes.CREATED,
    body: "",
  };
};
