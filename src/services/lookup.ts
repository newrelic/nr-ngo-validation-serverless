import { config } from '../config';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { sendGetRequest, createLookupApiUrl } from '../utils/http-util';
import { LambdaResponses } from '../utils/lambda-responses';
import { validateLookupResponse } from '../utils/token-validator';

export const getResponseFromLookup = async (token: string): Promise<LookupLargeResponse | LambdaResponses> => {
  const lookUpApiUrl = createLookupApiUrl(config.LOOKUP_API_URL, token);
  const lookupRes = await sendGetRequest<LookupLargeResponse>(lookUpApiUrl);
  const validatedLookupResponse = validateLookupResponse(lookupRes);

  return validatedLookupResponse;
};

export const getExpirationDateFromResponse = (pin: string, lookupResponse: LookupLargeResponse): number => {
  let expirationDate = 0;

  for (const agent of lookupResponse.returnStatus.data[0].agents) {
    if (pin === agent.pin) {
      expirationDate = agent.expiration_date;
    }
  }

  return expirationDate;
};

export const getStatusFromResponse = (lookupResponse: LookupLargeResponse): number => {
  return lookupResponse.returnStatus.data[0].status.type_value as number;
};
