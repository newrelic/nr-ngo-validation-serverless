import { createLookupApiUrl } from '../../src/utils/http-util';

describe('HTTP util tests', () => {
  it('Create valid lookup api url', () => {
    const apiUrl = 'https://myapi.com/v1';
    const token = 'token';
    const expectedUrl = 'https://myapi.com/v1/sessionKey/?token=token';

    expect(createLookupApiUrl(apiUrl, token)).toEqual(expectedUrl);
  });
});
