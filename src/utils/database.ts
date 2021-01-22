export const getAllValidationAttempts = async (data: any): Promise<any | undefined> => {
  const result = await data.query(`SELECT * FROM validation_attempts`);

  return result;
};

export const getValidationAttemptByToken = async (data: any, token: string): Promise<any | undefined> => {
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
