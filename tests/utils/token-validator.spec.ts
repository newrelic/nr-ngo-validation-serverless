import {
  isTokenValid,
  validateLookupResponse,
  getPinFromToken,
  isTokenExpired,
} from "../../src/utils/token-validator";
import { LookupApiFixtures } from "../fixtures/lookup-api-fixtures";
import { LambdaResponses } from "../../src/utils/lambda-responses";

const allowed = "https://allowed.newrelic.com";

describe("Token utils", () => {
  it("Provided token has got proper format", () => {
    const correctToken = "pin12355@321handle";
    expect(isTokenValid(correctToken)).toEqual(true);
  });

  it("Provided token has got invalid format", () => {
    const invalidTokens = ["pinhandle", "pin@pin@handle", "pin@ handle"];

    expect(isTokenValid(invalidTokens[0])).toEqual(false);
    expect(isTokenValid(invalidTokens[1])).toEqual(false);
    expect(isTokenValid(invalidTokens[2])).toEqual(false);
  });

  it("From the given token, pin is excluded", () => {
    const token = "12345678@qwerty";
    const expectedPin = "12345678";

    expect(getPinFromToken(token)).toEqual(expectedPin);
  });

  it("Check of token expiration return true, token expired", () => {
    const token = "1234abcd@qwer";

    expect(
      isTokenExpired(
        token,
        LookupApiFixtures.validLookupApiButTokenExpiredResponse
      )
    ).toBe(true);
  });

  it("Check of token expiration return false, token is valid", () => {
    const token = "1234abcd@qwer";
    const response = LookupApiFixtures.validLookupApiResponse;
    response.returnStatus.data[0].agents[0].expiration_date = Date.now() + 1000;

    expect(isTokenExpired(token, response)).toBe(false);
  });

  it("Too short token should return false in validation token", () => {
    const tooShortToken = "12@abcd";

    expect(isTokenValid(tooShortToken)).toBe(false);
  });

  it("Too long token should return false in validation token", () => {
    const tooLongToken = "1234567890@abcd";

    expect(isTokenValid(tooLongToken)).toBe(false);
  });

  it("Correct pin length of the token", () => {
    const validToken = "12345678@abc";

    expect(isTokenValid(validToken)).toBe(true);
  });
});

describe("Lookup response validation", () => {
  it("Correct response from lookup api should pass the validation check", () => {
    expect(
      validateLookupResponse(LookupApiFixtures.validLookupApiResponse, allowed)
    ).toEqual(LookupApiFixtures.validLookupApiResponse);
  });

  it("Incorrect response (empty array) from lookup api should return no data for provided token", () => {
    expect(
      validateLookupResponse(LookupApiFixtures.invalidLookupResponse, allowed)
    ).toEqual(LambdaResponses.noDataForProvidedToken(allowed));
  });
});
