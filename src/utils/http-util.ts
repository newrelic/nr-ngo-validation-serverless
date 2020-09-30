import fetch from 'node-fetch';
import { config } from '../config';

export const sendGetRequest = async <T>(url: string): Promise<T> => {
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

export const createConstraintApiUrl = (
  apiUrl: string,
  orgId: string,
): string => {
  return `${apiUrl}/${config.SESSION_KEY}/?constraint_id=${config.CONSTRAINT_ID}&org_id=${orgId}`;
};
