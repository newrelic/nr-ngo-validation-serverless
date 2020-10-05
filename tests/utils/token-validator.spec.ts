import {
  isTokenValid,
  validateLookupResponse,
  getPinFromToken,
  isTokenExpired,
} from '../../src/utils/token-validator';
import { LookupApiFixtures } from '../fixtures/lookup-api-fixtures';
import { LambdaResponses } from '../../src/utils/lambda-responses';

describe('Token utils', () => {
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

  it('From the given token, pin is excluded', () => {
    const token = '12345@qwerty';
    const expectedPin = '12345';

    expect(getPinFromToken(token)).toEqual(expectedPin);
  });

  it('Check of token expiration return true, token expired', () => {
    const token = '1234@qwer';

    expect(
      isTokenExpired(
        token,
        LookupApiFixtures.validLookupApiButTokenExpiredResponse,
      ),
    ).toBe(true);
  });

  it('Check of token expiration return false, token is valid', () => {
    const token = '1234@qwer';
    const response = LookupApiFixtures.validLookupApiResponse;
    response.returnStatus.data[0].agents[0].expiration_date = Date.now() + 1000;

    expect(isTokenExpired(token, response)).toBe(false);
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
