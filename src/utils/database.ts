import { config } from '../config';
import DataApiClient from 'data-api-client';
import { DatabaseContext, ValidationAttempts } from '../types/database';

const databaseContext: DatabaseContext = {
  resourceArn: config.DATABASE_RESOURCE_ARN,
  secretArn: config.DATABASE_SECRET_ARN,
  database: config.DATABASE,
};

const dbClient = DataApiClient(databaseContext);

export const getAll = async (): Promise<ValidationAttempts | undefined> => {
  const result = dbClient.query(`SELECT * FROM validation_attempts`);
  return result;
};

export const getValidationAttempts = async (
  accountId: number,
  orderBy: string,
  orderByDirection: boolean,
  limit: number,
  offset: number,
): Promise<ValidationAttempts | undefined> => {
  const result = dbClient.query({
    sql: `SELECT * FROM validation_attempts
          WHERE account_id = :account_id
          ORDER BY :column ${orderByDirection ? 'ASC' : 'DESC'}
          LIMIT :limit
          OFFSET :offset`,
    parameters: [
      {
        account_id: accountId,
      },
      {
        column: orderBy,
      },
      {
        direction: orderByDirection,
      },
      {
        limit: limit,
      },
      {
        offset: offset,
      },
    ],
  });

  return result;
};

export const getAllValidationAttempts = async (
  orderBy: string,
  orderByDirection: boolean,
  limit: number,
  offset: number,
): Promise<ValidationAttempts | undefined> => {
  const result = dbClient.query({
    sql: `SELECT * FROM validation_attempts
          ORDER BY :column ${orderByDirection ? 'ASC' : 'DESC'}
          LIMIT :limit
          OFFSET :offset`,
    parameters: [
      {
        column: orderBy,
      },
      {
        direction: orderByDirection,
      },
      {
        limit: limit,
      },
      {
        offset: offset,
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

export const getValidationAttemptByAccountId = async (accountId: number): Promise<ValidationAttempts | undefined> => {
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
  accountId: number,
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
  accountId: number,
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
