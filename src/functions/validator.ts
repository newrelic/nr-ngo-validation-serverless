import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { LambdaResponse } from "../types/response";
import { LambdaResponses } from "../utils/lambda-responses";
import { isTokenValid, isTokenExpired } from "../utils/token-validator";
import {
  getResponseFromLookup,
  getStatusFromResponse,
} from "../services/lookup";
import {
  getOrgId,
  getResponseFromConstraint,
  getOrgName,
} from "../services/constraint";
import { LookupLargeResponse } from "../types/lookupLargeResponse";
import { ConstraintResponse, DataObject } from "../types/constraintResponse";
import { Status } from "../utils/status";
import { StatusCodes } from "http-status-codes";
import { translateErrorMessages } from "../utils/error-message-translator";
import { config } from "../config";
import { ResponseType } from "../types/common";
import { Logger } from "../utils/logger";
import { checkIfOrgIdExist, saveLookupLargeResponse } from "../utils/database";
import { ValidationAttempts } from "../types/database";
import Newrelic from "newrelic";
import { validatorEvent } from "../types/nrEvents";
import { handleDistributedTracing } from "../utils/distributed_tracing";

export const validate = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse | ConstraintResponse> => {
  return handleDistributedTracing("nr-o4g-validator", async () => {
    const logger = new Logger(context);
    const queryStringParams = event.queryStringParameters || {};
    const nrEvent: validatorEvent = {
      func: "Validator",
      token: queryStringParams?.token ?? "undefined",
      session_key: queryStringParams?.session_key ?? "undefined",
      constraint_id: queryStringParams?.constraint_id ?? "undefined",
    };

    let lookupResponse: any;
    let constraintResponse: ConstraintResponse;
    let response: DataObject = null;
    let sessionKey = "";
    let constraintId = "";

    Newrelic.recordCustomEvent("NrO4GValidateAccount", {
      ...nrEvent,
      ...{ action: "start" },
    });

    logger.info("Checking incoming request from the platform...");
    if (config.SESSION_KEY === "") {
      if (queryStringParams.session_key) {
        sessionKey = queryStringParams.session_key;
      } else {
        Newrelic.recordCustomEvent("NrO4GValidateAccount", {
          ...nrEvent,
          ...{ action: "bad_request" },
        });
        logger.info(`Missing data`, "Debugging");
        return LambdaResponses.missingRequiredData();
      }
    }

    if (config.CONSTRAINT_ID === "") {
      if (queryStringParams.constraintId) {
        constraintId = queryStringParams.constraintId;
      } else {
        Newrelic.recordCustomEvent("NrO4GValidateAccount", {
          ...nrEvent,
          ...{ action: "bad_request" },
        });
        logger.info(`Missing data`, "Debugging");
        return LambdaResponses.missingRequiredData();
      }
    }

    logger.info("Starting token validation...", "", queryStringParams.token);
    // Token validation
    if (Object.keys(queryStringParams).length === 0) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      logger.info("No token provided", "Debugging");
      return LambdaResponses.noTokenProvided();
    }

    logger.info("Checking if token is valid given by user...");
    if (!isTokenValid(queryStringParams.token)) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      logger.info("Bad token provided", "Debugging");
      return LambdaResponses.badTokenProvided();
    }

    logger.info(
      "Sending request to Lookup API...",
      "",
      queryStringParams.token
    );
    // Lookup API
    if (config.SESSION_KEY !== "") {
      lookupResponse = await getResponseFromLookup(queryStringParams.token);
      logger.info(JSON.stringify(lookupResponse), "", queryStringParams.token);
    } else {
      lookupResponse = await getResponseFromLookup(
        queryStringParams.token,
        sessionKey
      );
      logger.info(JSON.stringify(lookupResponse), "", queryStringParams.token);
    }

    if (lookupResponse.body) {
      return LambdaResponses.noDataForProvidedToken();
    }

    // Constraing API
    logger.info("Getting org_id and org_name...", queryStringParams.token);
    const orgId = getOrgId(lookupResponse as LookupLargeResponse);
    const orgName = getOrgName(lookupResponse as LookupLargeResponse);

    if (
      isTokenExpired(
        queryStringParams.token,
        lookupResponse as LookupLargeResponse
      )
    ) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "token_expired" },
      });
      logger.info("Dead token provided", "Debugging");
      return LambdaResponses.tokenExpired();
    }

    const orgStatus = getStatusFromResponse(
      lookupResponse as LookupLargeResponse
    );

    if (orgStatus !== Status.VerificationStatus.Qualified) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "not_qualified" },
      });
      logger.info("Not qualified", "Debugging");
      return LambdaResponses.notQualified();
    }

    logger.info(
      "Sending request to Constraint API...",
      "",
      queryStringParams.token
    );
    logger.info(
      "Checking if organisation already exists and is elibile...",
      "",
      queryStringParams.token
    );
    const result: ValidationAttempts = await checkIfOrgIdExist(orgId);

    if (result.records.length > 0) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "org_exists" },
      });
      logger.info("Organisation used", "Debugging");
      return LambdaResponses.organisationAlreadyExist();
    }

    logger.info("Saving LLR to the database...", queryStringParams.token);
    await saveLookupLargeResponse(orgId, JSON.stringify(lookupResponse));
    logger.info("Saved LLR to the database...", queryStringParams.token);

    if (config.CONSTRAINT_ID !== "") {
      constraintResponse = await getResponseFromConstraint(orgId);
    } else {
      constraintResponse = await getResponseFromConstraint(
        orgId,
        sessionKey,
        constraintId
      );
    }

    if (constraintResponse.returnStatus.data.length === 0) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "lambda_misconfiguration" },
      });
      logger.info("Wrong configuration provided", "Debugging");
      return LambdaResponses.wrongConfiguration();
    }

    if (config.RESPONSE_TYPE === ResponseType.Full.toString()) {
      logger.info(
        "Returning basic response from constraint API",
        "",
        queryStringParams.token
      );

      if (!constraintResponse) {
        Newrelic.recordCustomEvent("NrO4GValidateAccount", {
          ...nrEvent,
          ...{ action: "no_data" },
        });
        return LambdaResponses.noDataForProvidedToken();
      } else {
        return {
          statusCode: StatusCodes.OK,
          body: JSON.stringify(constraintResponse),
        };
      }
    }

    if (!constraintResponse.returnStatus.data) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "no_data" },
      });
      return LambdaResponses.noDataForProvidedToken();
    } else {
      [response] = constraintResponse.returnStatus.data;
    }
    logger.info(`Response: ${response}`, "Debugging");

    logger.info("Translating the error messages", "", queryStringParams.token);
    const errorCodes = translateErrorMessages(response.error_code as string[]);
    logger.info(`Error codes: ${errorCodes}`, "Debugging");
    response.error_code = errorCodes;
    response.org_name = orgName;

    logger.info(`Final response: ${response}`, "Debugging");

    logger.info("Returning the response", "", queryStringParams.token);
    Newrelic.recordCustomEvent("NrO4GValidateAccount", {
      ...nrEvent,
      ...{ action: "success" },
    });
    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(response),
    };
  });
};
