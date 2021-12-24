import { LambdaResponse } from "../types/response";
import { StatusCodes } from "http-status-codes";

export class LambdaResponses {
  public static readonly noTokenProvided = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({
          internalStatusCode: 40001,
          message: "No token provided",
        }),
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

  public static readonly badTokenProvided = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({
          internalStatusCode: 40002,
          message: "Bad token provided",
        }),
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

  public static readonly missingRequiredData = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({
          internalStatusCode: 40003,
          message:
            "The session_key and constraint_id are not defined. Please define them in .env or send them as params in request.",
        }),
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

  public static readonly badRequest = (allowed: string): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({
          internalStatusCode: 40004,
          message: "Bad parameters provided to endpoint.",
        }),
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

  public static readonly tokenExpired = (allowed: string): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          internalStatusCode: 40101,
          message: "Verified - TechSoup Token expired",
        }),
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

  public static readonly notQualified = (allowed: string): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          internalStatusCode: 40102,
          message: "Sorry you do not qualified",
        }),
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

  public static readonly tokenAlreadyUsed = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          internalStatusCode: 40103,
          message: "Token was already used",
        }),
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

  public static readonly tokenInRetentionPeriod = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          internalStatusCode: 40104,
          message: "Token already used in the last 30 days",
        }),
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

  public static readonly organisationAlreadyExist = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          internalStatusCode: 40105,
          message: "Organisation already exists",
        }),
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

  public static readonly accountAlreadyExist = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          internalStatusCode: 40106,
          message: "Probably the account is already manual approved",
        }),
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

  public static readonly noEndpoint = (allowed: string): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({
          internalStatusCode: 40401,
          message: "This endpoint does not exist",
        }),
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

  public static readonly noDataForProvidedToken = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({
          internalStatusCode: 40402,
          message: "No data for provided token",
        }),
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

  public static readonly noDataForProvidedOrgId = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({
          internalStatusCode: 40403,
          message: "No data for provided organisation id",
        }),
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

  public static readonly wrongConfiguration = (
    allowed: string
  ): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({
          internalStatusCode: 50001,
          message:
            "There are issues with lambda configuration, please verify it",
        }),
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

  public static readonly cannotSaveToDB = (allowed: string): LambdaResponse => {
    if (allowed != "Denied") {
      return {
        headers: {
          "Access-Control-Allow-Origin": allowed,
        },
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({
          internalStatusCode: 50002,
          message: "Cannot save to the database...",
        }),
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
}
