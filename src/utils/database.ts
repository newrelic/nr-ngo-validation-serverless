import { RDSDataService } from 'aws-sdk';
import { DatabaseContext, ValidationAttemptsRecord } from '../types/database';

export const getAllValidationAttempts = async (
  rds: RDSDataService,
  databaseContext: DatabaseContext,
): Promise<RDSDataService.SqlRecords | undefined> => {
  const query: RDSDataService.ExecuteStatementRequest = {
    includeResultMetadata: false,
    resourceArn: databaseContext.resourceArn,
    secretArn: databaseContext.secretArn,
    database: databaseContext.database,
    sql: `SELECT * FROM validation_attempts;`,
  };

  const result = await rds.executeStatement(query).promise();
  return result.records;
};

export const getValidationAttemptByAccountId = async (
  rds: RDSDataService,
  databaseContext: DatabaseContext,
  accountId: string,
): Promise<RDSDataService.SqlRecords | undefined> => {
  throw new Error('Not implemented yet.');
};

export const saveValidationAttempt = async (
  rds: RDSDataService,
  databaseContext: DatabaseContext,
  attempt: ValidationAttemptsRecord,
): Promise<RDSDataService.SqlRecords | undefined> => {
  throw new Error('Not implemented yet.');
};
