import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { LookupLargeResponse, LookupLargeResponses } from "../types/database";
import { LambdaResponse } from "../types/response";
import { getLookupLargeResponse } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";

export const getLookupResponse = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  const logger = new Logger(context);
  const params = event.queryStringParameters || {};

  if (!params.orgId) {
    logger.error("No org id was given!");
    return LambdaResponses.badRequest;
  }

  logger.info(
    `Getting lookup large response from database for given orgid: ${params.orgId}...`
  );
  const response: LookupLargeResponses = await getLookupLargeResponse(
    params.orgId
  );

  if (response.records.length === 0) {
    logger.error("There is no data for given orgId!");
    return LambdaResponses.noDataForProvidedOrgId;
  }

  logger.info(`Return object for orgId = ${params.orgId}`);
  const data: LookupLargeResponse = response.records[0];

  logger.info("Parsing data from llr...");
  const result = JSON.parse(data.response);

  return {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    statusCode: StatusCodes.OK,
    body: JSON.stringify(result),
  };
};
