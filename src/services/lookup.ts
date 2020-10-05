import { config } from '../config';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { sendGetRequest, createLookupApiUrl } from '../utils/http-util';
import { LambdaResponses } from '../utils/lambda-responses';
import { validateLookupResponse } from '../utils/token-validator';

export const getResponseFromLookup = async (
  token: string,
): Promise<LookupLargeResponse | LambdaResponses> => {
  const lookUpApiUrl = createLookupApiUrl(config.LOOKUP_API_URL, token);
  const lookupRes = await sendGetRequest<LookupLargeResponse>(lookUpApiUrl);

  // TODO: Validate token expiration date

  const validatedLookupResponse = validateLookupResponse(lookupRes);

  return validatedLookupResponse;
};
