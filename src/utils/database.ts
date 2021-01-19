import { RDSDataService } from 'aws-sdk';
import { DatabaseContext } from '../types/database';

export const getAllRecords = async (
  rds: RDSDataService,
  databaseContext: DatabaseContext,
): Promise<RDSDataService.SqlRecords | undefined> => {
  const query: RDSDataService.ExecuteStatementRequest = {
    includeResultMetadata: true,
    resourceArn: databaseContext.resourceArn,
    secretArn: databaseContext.secretArn,
    database: databaseContext.database,
    sql: `SELECT * FROM validation_attempts;`,
  };

  const result = await rds.executeStatement(query).promise();
  return result.records;
};
