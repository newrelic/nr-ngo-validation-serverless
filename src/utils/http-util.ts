import fetch from 'node-fetch';
import { LookupLargeResponse } from '../types/lookupLargeResponse';
import { config } from '../config';

export const sendGetRequestToLookup = async (
  url: string
): Promise<LookupLargeResponse | null> => {
  try {
    const response = await fetch(url, {
      method: 'get',
    });

    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};

export const createLookupApiUrl = (apiUrl: string, token: string): string => {
  return `${apiUrl}/${config.SESSION_KEY}/?token=${token}`;
};

export const createConstraintApiUrl = (): string | Error => {
  return new Error('Method not implemented...');
};
