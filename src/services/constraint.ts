import { config } from '../config';
import { ConstraintResponse } from '../types/constraintResponse';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { LambdaResponse } from '../types/response';
import { createConstraintApiUrl, sendGetRequest } from '../utils/http-util';
import { LambdaResponses } from '../utils/lambda-responses';

export const getResponseFromConstraint = async (orgId: string): Promise<ConstraintResponse> => {
  const constraintApiUrl = createConstraintApiUrl(config.CONSTRAINT_API_URL, orgId);

  const constraintResponse = await sendGetRequest<ConstraintResponse>(constraintApiUrl);

  return constraintResponse;
};

export const getOrgId = (lookupResponse: LookupLargeResponse): string => {
  return lookupResponse.returnStatus.data[0].org_id;
};

export const checkEligibility = (response: ConstraintResponse): LambdaResponse => {
  if (response.returnStatus.data[0].eligibility_status) {
    return LambdaResponses.eligible;
  }

  return LambdaResponses.notEligible;
};
