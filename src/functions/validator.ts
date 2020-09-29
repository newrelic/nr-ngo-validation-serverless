import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';
import { sendGetRequest } from '../utils/http-util';
import { createLookupApiUrl, createConstraintApiUrl } from '../utils/http-util';
import { config } from '../config';
import { LambdaResponse } from '../types/response';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { ConstraintResponse } from '../types/constraintResponse';

export const validate: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<LambdaResponse> => {
  // eslint-disable-next-line no-console
  console.log(_context);

  const lookUpApiUrl = createLookupApiUrl(
    config.LOOKUP_API_URL,
    event.queryStringParameters['token']
  );
  const lookupRes = await sendGetRequest<LookupLargeResponse>(lookUpApiUrl);
  // TODO: Validate if org_is is returned in response

  // TODO: call Constraint API if org_id exists

  if (lookupRes) {
    const orgId = lookupRes.returnStatus.data[0].org_id;

    const constraintApiUrl = createConstraintApiUrl(
      config.CONSTRAINT_API_URL,
      orgId
    );

    const constraintRes = await sendGetRequest<ConstraintResponse>(
      constraintApiUrl
    );
    console.log('constraintRes', constraintRes);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: lookupRes }, null, 2),
  };
};
