import * as fetch from 'node-fetch';
import { getResponseFromLookup } from '../../src/services/lookup';
import { LookupLargeResponse } from '../../src/types/lookupLargeResponse';
import { LambdaResponses } from '../../src/utils/lambda-responses';
import { LookupApiFixtures } from '../fixtures/lookup-api-fixtures';

const fetchMock = jest.spyOn(fetch, 'default');
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Response } = fetch;

let expectedValidResponse: LookupLargeResponse;
let invalidResponse: LookupLargeResponse;
let expectedError: LambdaResponses;

describe('Lookup API', () => {
  beforeAll(() => {
    expectedValidResponse = LookupApiFixtures.validLookupApiResponse;
    invalidResponse = LookupApiFixtures.invalidLookupResponse;
    expectedError = LambdaResponses.noDataForProvidedToken;
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

    expect(response).toEqual(expectedError);
  });
});
