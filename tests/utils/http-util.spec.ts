import {
  createConstraintApiUrl,
  createLookupApiUrl,
} from '../../src/utils/http-util';
import { config } from '../../src/config';

describe('HTTP util tests', () => {
  const sessionKey = config.SESSION_KEY;

  it('Create valid lookup api url', () => {
    const apiUrl = config.LOOKUP_API_URL;
    const token = 'pin@handle';
    const expectedUrl = `${apiUrl}/${sessionKey}/?token=${token}`;

    expect(createLookupApiUrl(apiUrl, token)).toEqual(expectedUrl);
  });

  it('Create valid constraint api url', () => {
    const apiUrl = config.CONSTRAINT_API_URL;
    const constraintId = config.CONSTRAINT_ID;
    const orgId = 'RandomOrgId';
    const expectedUrl = `${apiUrl}/${sessionKey}/?constraint_id=${constraintId}&org_id=${orgId}`;

    expect(createConstraintApiUrl(apiUrl, orgId)).toEqual(expectedUrl);
  });
});
