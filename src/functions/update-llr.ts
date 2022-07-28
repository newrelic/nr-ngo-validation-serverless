import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { getOrgId } from "../services/constraint";
import { getResponseFromLookup } from "../services/lookup";
import { LookupLargeResponse } from "../types/lookupLargeResponse";
import { LambdaResponse } from "../types/response";
import { saveLookupLargeResponse } from "../utils/database";
import { LambdaResponses } from "../utils/lambda-responses";
import { Logger } from "../utils/logger";
import Newrelic from "newrelic";
import { updateLlrEvent } from "../types/nrEvents";
import { handleDistributedTracing } from "../utils/distributed_tracing";

export const updateLookupLargeResponse = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse> => {
  return handleDistributedTracing("nr-o4g-update-llr", async () => {
    const logger = new Logger(context);
    const params = event.queryStringParameters || {};
    const nrEvent: updateLlrEvent = {
      func: "UpdateLLR",
      token: params?.token ?? "undefined",
    };

    Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
      ...nrEvent,
      ...{ action: "start" },
    });

    let lookupResponse: LookupLargeResponse;

    if (!params.token) {
      Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      logger.error("No org id was given!");
      return LambdaResponses.noTokenProvided();
    }

    try {
      lookupResponse = (await getResponseFromLookup(
        params.token
      )) as LookupLargeResponse;
    } catch (error: any) {
      Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
        ...nrEvent,
        ...{ action: "no_data_for_token" },
      });
      logger.error(`Cannot fetch data from TS. Details: ${error}`);
      return LambdaResponses.noDataForProvidedToken();
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
      return LambdaResponses.cannotSaveToDB();
    }

    Newrelic.recordCustomEvent("NrO4GUpdateLLR", {
      ...nrEvent,
      ...{ action: "success" },
    });

    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: StatusCodes.CREATED,
      body: "",
    };
  });
};
