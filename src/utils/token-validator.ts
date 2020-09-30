import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from './lambda-responses';

export const validateLookupResponse = (
  lookupResponse: LookupLargeResponse,
): LookupLargeResponse | LambdaResponse => {
  if (lookupResponse.returnStatus.data.length === 0) {
    return LambdaResponses.noDataForProvidedToken;
  }

  return lookupResponse;
};

export const isTokenValid = (token: string): boolean => {
  if (token.includes('@')) {
    const splittedToken = token.split('@');
    console.log(`Splitted Token: ${splittedToken.length}`);
    return true;
  }

  return false;
};
