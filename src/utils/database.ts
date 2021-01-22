import { ValidationAttempts } from '../types/database';

export const getAllValidationAttempts = async (data: any): Promise<any | undefined> => {
  const result = await data.query(`SELECT * FROM validation_attempts`);

  return result;
};

export const getValidationAttemptByToken = async (
  data: any,
  token: string,
): Promise<ValidationAttempts | undefined> => {
  const result = await data.query({
    sql: `SELECT * FROM validation_attempts WHERE token = :token AND eligibility_status = TRUE`,
    parameters: [
      {
        token: token,
      },
    ],
  });

  return result;
};

export const getValidationAttemptByTokenAndAccountId = async (
  data: any,
  token: string,
  accountId: number,
): Promise<ValidationAttempts | undefined> => {
  const result = await data.query({
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
