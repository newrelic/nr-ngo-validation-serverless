import { DatabaseContext, ValidationAttempts, ValidationHistoryRequest, ValidationCount } from '../types/database';
import { config } from '../config';
import DataApiClient from 'data-api-client';

const databaseContext: DatabaseContext = {
  resourceArn: config.DATABASE_RESOURCE_ARN,
  secretArn: config.DATABASE_SECRET_ARN,
  database: config.DATABASE,
};

const dbClient = DataApiClient(databaseContext);

export const getAll = async (): Promise<ValidationAttempts | undefined> => {
  const result = await dbClient.query(`SELECT * FROM validation_attempts'`);
  return result;
};

export const getValidationAttempts = async (
  sqlQuery: string,
  params: ValidationHistoryRequest,
): Promise<ValidationAttempts | ValidationCount | undefined> => {
  const result = await dbClient.query({
    sql: sqlQuery,
    parameters: [
      {
        account_id: params.accountId,
      },
      {
        search_phrase: params.searchPhrase,
      },
      {
        column: params.orderBy,
      },
      {
        direction: params.orderAsc,
      },
      {
        limit: params.limit,
      },
      {
        offset: params.offset,
      },
      {
        start_date: params.startDate,
      },
      {
        end_date: params.endDate,
      },
    ],
  });

  return result;
};

export const getValidationAttemptByToken = async (token: string): Promise<ValidationAttempts | undefined> => {
  const result = await dbClient.query({
    sql: `SELECT * FROM validation_attempts WHERE token = :token AND eligibility_status = TRUE`,
    parameters: [
      {
        token: token,
      },
    ],
  });

  return result;
};

export const checkValidationDate = async (token: string, accountId: string): Promise<ValidationCount | undefined> => {
  const result = await dbClient.query({
    sql: `SELECT COUNT(*) FROM validation_attempts
          WHERE token = :token
          AND account_id = :account_id
          AND eligibility_status = FALSE
          AND validation_date < (NOW() - INTERVAL '30' DAY)`,
    parameters: [
      {
        token: token,
      },
      {
        account_id: accountId,
      },
    ],
  });

  return result;
};

export const getValidationAttemptByAccountId = async (accountId: string): Promise<ValidationAttempts | undefined> => {
  const result = await dbClient.query({
    sql: `SELECT * FROM validation_attempts
          WHERE account_id = :account_id
          ORDER BY validation_date DESC
          LIMIT 1`,
    parameters: [
      {
        account_id: accountId,
      },
    ],
  });

  return result;
};

export const getValidationAttemptByTokenAndAccountId = async (
  token: string,
  accountId: string,
): Promise<ValidationAttempts | undefined> => {
  const result = await dbClient.query({
    sql: `SELECT * FROM validation_attempts WHERE
          token = :token AND
          account_id = :account_id AND
          ORDER BY validation_date DESC
          LIMIT 1`,
    parameters: [
      {
        token: token,
        account_id: accountId,
      },
    ],
  });

  return result;
};

export const saveValidationAttempt = async (
  token: string,
  accountId: string,
  eligibilityStatus: boolean,
  orgId: string,
  orgName: string,
  reason: string,
): Promise<any | undefined> => {
  const result = await dbClient.query({
    sql: `INSERT INTO validation_attempts (eligibility_status, token, account_id, org_id, org_name, reason)
      VALUES (:eligibility_status, :token, :account_id, :org_id, :org_name, :reason)`,
    parameters: [
      {
        token: token,
        account_id: accountId,
        eligibility_status: eligibilityStatus,
        org_id: orgId,
        org_name: orgName,
        reason: reason || '',
      },
    ],
  });
  return result;
};

export const checkIfOrgIdExist = async (orgId: string): Promise<ValidationAttempts | undefined> => {
  const result = await dbClient.query({
    sql: `SELECT * FROM validation_attempts WHERE org_id = :org_id AND eligibility_status = true LIMIT 1`,
    parameters: [
      {
        org_id: orgId,
      },
    ],
  });

  return result;
};
