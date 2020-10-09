import * as fetch from 'node-fetch';
import { getOrgId, getResponseFromConstraint, checkEligibility } from '../../src/services/constraint';
import { ConstraintResponse } from '../../src/types/constraintResponse';
import { LookupLargeResponse } from '../../src/types/lookupLargeResponse';
import { LambdaResponse } from '../../src/types/response';
import { LambdaResponses } from '../../src/utils/lambda-responses';
import { ConstraintApiFixtures } from '../fixtures/constraint-api-fixtures';
import { LookupApiFixtures } from '../fixtures/lookup-api-fixtures';

const fetchMock = jest.spyOn(fetch, 'default');
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Response } = fetch;

let positiveResponse: ConstraintResponse;
let negativeResponse: ConstraintResponse;
let validLookupApiResponse: LookupLargeResponse;
let eligible: LambdaResponse;
let notEligible: LambdaResponse;

describe('Constraint API', () => {
  beforeAll(() => {
    positiveResponse = ConstraintApiFixtures.allPassResponse;
    negativeResponse = ConstraintApiFixtures.eligibilityStatusFalse;
    validLookupApiResponse = LookupApiFixtures.validLookupApiResponse;
    eligible = LambdaResponses.eligible;
    notEligible = LambdaResponses.notEligible;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return valid response', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(positiveResponse)));

    const response = await getResponseFromConstraint('thisShouldBeOrgId');

    expect(response).toEqual(positiveResponse);
  });

  it('Should return orgId from the lookup response', () => {
    const expectedOrgId = '54321_0000';

    expect(getOrgId(validLookupApiResponse)).toEqual(expectedOrgId);
  });

  it('Should return eligibility true', () => {
    expect(checkEligibility(positiveResponse)).toBe(eligible);
  });

  it('Should return eligibility false', () => {
    expect(checkEligibility(negativeResponse)).toBe(notEligible);
  });
});
