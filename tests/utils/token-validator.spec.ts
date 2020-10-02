import {
  isTokenValid,
  validateLookupResponse,
} from '../../src/utils/token-validator';
import { LookupApiFixtures } from '../fixtures/lookup-api-fixtures';
import { LambdaResponses } from '../../src/utils/lambda-responses';

describe('Lookup API validation path', () => {
  it('Provided token has got proper format', () => {
    const correctToken = 'pin123@321handle';
    expect(isTokenValid(correctToken)).toEqual(true);
  });

  it('Provided token has got invalid format', () => {
    const invalidTokens = ['pinhandle', 'pin@pin@handle', 'pin@ handle'];
    invalidTokens.forEach((token) => {
      expect(isTokenValid(token)).toEqual(false);
    });
  });
});

describe('Lookup response validation', () => {
  it('Correct response from lookup api should pass the validation check', () => {
    expect(
      validateLookupResponse(LookupApiFixtures.validLookupApiResponse),
    ).toEqual(LookupApiFixtures.validLookupApiResponse);
  });

  it('Incorrect response (empty array) from lookup api should return no data for provided token', () => {
    expect(
      validateLookupResponse(LookupApiFixtures.invalidLookupResponse),
    ).toEqual(LambdaResponses.noDataForProvidedToken);
  });
});
