import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { LambdaResponse } from '../types/response';
import { LambdaResponses } from './lambda-responses';
import { getExpirationDateFromResponse } from '../services/lookup';

export const validateLookupResponse = (lookupResponse: LookupLargeResponse): LookupLargeResponse | LambdaResponse => {
  if (lookupResponse.returnStatus.data.length === 0) {
    return LambdaResponses.noDataForProvidedToken;
  }

  return lookupResponse;
};

const TOKEN_REGEX = /^[a-zA-Z0-9]+(@)[a-zA-Z0-9]+$/;

export const isTokenValid = (token: string): boolean => {
  if (token) {
    const regex = new RegExp(TOKEN_REGEX);
    return regex.test(token);
  }
  return false;
};

export const isTokenExpired = (token: string, lookupResponse: LookupLargeResponse): boolean => {
  const pin = getPinFromToken(token);
  const expirationDate = getExpirationDateFromResponse(pin, lookupResponse);

  if (Date.now() > expirationDate) {
    return true;
  }

  return false;
};

export const getPinFromToken = (token: string): string => {
  const splittedToken = token.split('@');

  return splittedToken[0];
};
