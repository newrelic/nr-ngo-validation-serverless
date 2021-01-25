import { config } from '../config';
import DataApiClient from 'data-api-client';
import { DatabaseContext, ValidationAttempts } from '../types/database';

const databaseContext: DatabaseContext = {
  resourceArn: config.DATABASE_RESOURCE_ARN,
  secretArn: config.DATABASE_SECRET_ARN,
  database: config.DATABASE,
};

const dbClient = DataApiClient(databaseContext);

export const getAllValidationAttempts = async (): Promise<any | undefined> => {
  const result = await dbClient.query(`SELECT * FROM validation_attempts`);
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
