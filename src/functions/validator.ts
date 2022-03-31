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
import { checker } from "../utils/cors-helper";
import Newrelic from "newrelic";
import { validatorEvent } from "../types/nrEvents";

export const validate = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<LambdaResponse | ConstraintResponse> => {
  const logger = new Logger(context);
  const queryStringParams = event.queryStringParameters || {};
  let origin = undefined;
  const nrEvent: validatorEvent = {
    func: "Validator",
    token: queryStringParams?.token,
    session_key: queryStringParams?.session_key,
    constraint_id: queryStringParams?.constraint_id,
  };

  if (event.headers.origin) {
    origin = [event.headers.origin];
  } else {
    origin = [""];
  }

  let allowed = "Denied";
  let lookupResponse: LookupLargeResponse | LambdaResponses;
  let constraintResponse: ConstraintResponse;
  let response: DataObject = null;
  let sessionKey = "";
  let constraintId = "";

  logger.info(`Origin: ${origin}`);

  if (origin.filter(checker).length > 0) {
    allowed = event.headers.origin;
  }

  logger.info(`Allowed: ${allowed}`);

  Newrelic.recordCustomEvent("NrO4GValidateAccount", {
    ...nrEvent,
    ...{ action: "start" },
  });

  if (allowed !== "Denied") {
    logger.info("Checking incoming request from the platform...");
    if (config.SESSION_KEY === "") {
      if (queryStringParams.session_key) {
        sessionKey = queryStringParams.session_key;
      } else {
        Newrelic.recordCustomEvent("NrO4GValidateAccount", {
          ...nrEvent,
          ...{ action: "bad_request" },
        });
        return LambdaResponses.missingRequiredData(allowed);
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
        return LambdaResponses.missingRequiredData(allowed);
      }
    }

    logger.info("Starting token validation...", "", queryStringParams.token);
    // Token validation
    if (Object.keys(queryStringParams).length === 0) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      return LambdaResponses.noTokenProvided(allowed);
    }

    logger.info("Checking if token is valid given by user...");
    if (!isTokenValid(queryStringParams.token)) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "bad_request" },
      });
      return LambdaResponses.badTokenProvided(allowed);
    }

    logger.info(
      "Sending request to Lookup API...",
      "",
      queryStringParams.token
    );
    // Lookup API
    if (config.SESSION_KEY !== "") {
      lookupResponse = await getResponseFromLookup(
        queryStringParams.token,
        allowed
      );
      logger.info(JSON.stringify(lookupResponse), "", queryStringParams.token);
    } else {
      lookupResponse = await getResponseFromLookup(
        queryStringParams.token,
        allowed,
        sessionKey
      );
      logger.info(JSON.stringify(lookupResponse), "", queryStringParams.token);
    }

    // Constraing API
    logger.info("Getting org_id and org_name...", queryStringParams.token);
    const orgId = getOrgId(lookupResponse as LookupLargeResponse);
    const orgName = getOrgName(lookupResponse as LookupLargeResponse);

    if (lookupResponse === LambdaResponses.noDataForProvidedToken(allowed)) {
      return lookupResponse as LambdaResponse;
    }

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
      return LambdaResponses.tokenExpired(allowed);
    }

    const orgStatus = getStatusFromResponse(
      lookupResponse as LookupLargeResponse
    );

    if (orgStatus !== Status.VerificationStatus.Qualified) {
      Newrelic.recordCustomEvent("NrO4GValidateAccount", {
        ...nrEvent,
        ...{ action: "not_qualified" },
      });
      return LambdaResponses.notQualified(allowed);
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
      return LambdaResponses.organisationAlreadyExist(allowed);
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
      return LambdaResponses.wrongConfiguration(allowed);
    }

    if (config.RESPONSE_TYPE === ResponseType.Full.toString()) {
      logger.info(
        "Returning basic response from constraint API",
        "",
        queryStringParams.token
      );

      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.OK,
        body: JSON.stringify(constraintResponse),
      };
    }

    [response] = constraintResponse.returnStatus.data;

    logger.info("Translating the error messages", "", queryStringParams.token);
    const errorCodes = translateErrorMessages(response.error_code as string[]);
    response.error_code = errorCodes;
    response.org_name = orgName;

    logger.info("Returning the response", "", queryStringParams.token);
    Newrelic.recordCustomEvent("NrO4GValidateAccount", {
      ...nrEvent,
      ...{ action: "success" },
    });
    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.OK,
      body: JSON.stringify(response),
    };
  } else {
    return {
      headers: {
        "Access-Control-Allow-Origin": allowed,
      },
      statusCode: StatusCodes.FORBIDDEN,
      body: "Access Denied.",
    };
  }
};
