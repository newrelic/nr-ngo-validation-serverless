import * as fetch from 'node-fetch';
import { getOrgId, getResponseFromConstraint } from '../../src/services/constraint';
import { ConstraintResponse } from '../../src/types/constraintResponse';
import { LookupLargeResponse } from '../../src/types/lookupLargeResponse';
import { ConstraintApiFixtures } from '../fixtures/constraint-api-fixtures';
import { LookupApiFixtures } from '../fixtures/lookup-api-fixtures';

const fetchMock = jest.spyOn(fetch, 'default');
// eslint-disable-next-line @typescript-eslint/naming-convention
const { Response } = fetch;

let positiveResponse: ConstraintResponse;
let validLookupApiResponse: LookupLargeResponse;

describe('Constraint API', () => {
  beforeAll(() => {
    positiveResponse = ConstraintApiFixtures.allPassResponse;
    validLookupApiResponse = LookupApiFixtures.validLookupApiResponse;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return valid response', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(positiveResponse)));

    const response = await getResponseFromConstraint('thisShouldBeOrgId');

    expect(response).toEqual(positiveResponse);
  });

  it('Should return valid response, with optional parameters', async () => {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(positiveResponse)));

    const response = await getResponseFromConstraint('thisShouldBeOrgId', 'yourSessionKey123', 'YOUR_ID');

    expect(response).toEqual(positiveResponse);
  });

  it('Should return orgId from the lookup response', () => {
    const expectedOrgId = '54321_0000';

    expect(getOrgId(validLookupApiResponse)).toEqual(expectedOrgId);
  });
});
