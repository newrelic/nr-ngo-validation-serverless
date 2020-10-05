import * as fetch from 'node-fetch';
import {
  getResponseFromLookup,
  getExpirationDateFromResponse,
} from '../../src/services/lookup';
import { LookupLargeResponse } from '../../src/types/lookupLargeResponse';
import { LambdaResponses } from '../../src/utils/lambda-responses';
import { LookupApiFixtures } from '../fixtures/lookup-api-fixtures';

const fetchMock = jest.spyOn(fetch, 'default');
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Response } = fetch;

let expectedValidResponse: LookupLargeResponse;
let invalidResponse: LookupLargeResponse;
let noDataForProvidedTokenError: LambdaResponses;

describe('Lookup API', () => {
  beforeAll(() => {
    expectedValidResponse = LookupApiFixtures.validLookupApiResponse;
    invalidResponse = LookupApiFixtures.invalidLookupResponse;
    noDataForProvidedTokenError = LambdaResponses.noDataForProvidedToken;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return valid response from Lookup API', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(expectedValidResponse)),
    );

    const response = await getResponseFromLookup('fake@token');

    expect(response).toEqual(expectedValidResponse);
  });

  it('Should return invalid response from Lookup API for given token', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(invalidResponse)),
    );

    const response = await getResponseFromLookup('bad@token');

    expect(response).toEqual(noDataForProvidedTokenError);
  });

  it('Should return expiration date from valid response', () => {
    const pin = '1234';
    const expectedExpirationDate = 1605629838458;
    const expirationDate = getExpirationDateFromResponse(
      pin,
      expectedValidResponse,
    );

    expect(expirationDate).toEqual(expectedExpirationDate);
  });
});
