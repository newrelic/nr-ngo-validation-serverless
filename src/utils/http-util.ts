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

/**
 * Creates request URL for Lookup API.
 *
 * @param apiUrl URL to API
 * @param token Lookup token
 * @param sessionKey Your session key; also known as API Key.
 */
export const createLookupApiUrl = (apiUrl: string, token: string, sessionKey?: string): string => {
  if (sessionKey) {
    return `${apiUrl}/${sessionKey}/?token=${token}`;
  }

  return `${apiUrl}/${config.SESSION_KEY}/?token=${token}`;
};

/**
 * Creates request URL for Constraing API.
 *
 * @param apiUrl URL to API
 * @param orgId Id of your organization.
 * @param sessionKey Your session key; also known as API Key.
 * @param constraintId
 */
export const createConstraintApiUrl = (
  apiUrl: string,
  orgId: string,
  sessionKey?: string,
  constraintId?: string,
): string => {
  if (sessionKey && constraintId) {
    return `${apiUrl}/${sessionKey}/?constraint_id=${constraintId}&org_id=${orgId}`;
  }

  return `${apiUrl}/${config.SESSION_KEY}/?constraint_id=${config.CONSTRAINT_ID}&org_id=${orgId}`;
};
