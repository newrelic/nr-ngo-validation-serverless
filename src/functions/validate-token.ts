import { APIGatewayEvent } from 'aws-lambda';
import { LambdaResponse } from '../types/response';
import { RDSDataService } from 'aws-sdk';
import { DatabaseContext } from '../types/database';
import { getAllRecords } from '../utils/database';
import { config } from '../config';

const rds = new RDSDataService();

const databaseContext: DatabaseContext = {
  resourceArn: config.DATABASE_RESOURCE_ARN,
  secretArn: config.DATABASE_SECRET_ARN,
  database: config.DATABASE,
};

/**
 * Checks if the provided token exists in the database.
 *
 * @param event Incoming event from API Gateway
 */
export const validateToken = async (event: APIGatewayEvent): Promise<LambdaResponse> => {
  const data = await getAllRecords(rds, databaseContext);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
