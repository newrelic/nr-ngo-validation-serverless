import { ConstraintResponse } from '../../src/types/constraintResponse';

export const ConstraintTranslatedFixtures = {
  emptyErrorCode: {
    returnStatus: {
      elapsed: '251.0 milliseconds',
      node: 'node1',
      reason: 'success',
      status_code: 200,
      data: [
        {
          program_code: 'PC1',
          org_id: '123456_qwerty',
          error_code: [],
          eligibility_status: true,
        },
      ],
      receipt: 'xyz',
      id: '1',
      status: 'ok',
    },
  } as ConstraintResponse,
  oneErrorCode: {
    returnStatus: {
      elapsed: '251.0 milliseconds',
      node: 'node1',
      reason: 'success',
      status_code: 200,
      data: [
        {
          program_code: 'PC1',
          org_id: '123456_qwerty',
          error_code: [
            {
              code: 'E00_1',
              group: 'System',
              text: 'Unknow client program',
              description: 'The program code being used is not a valid code forthis client',
            },
          ],
          eligibility_status: true,
        },
      ],
      receipt: 'xyz',
      id: '1',
      status: 'ok',
    },
  } as ConstraintResponse,
  twoErrorCodes: {
    returnStatus: {
      elapsed: '251.0 milliseconds',
      node: 'node1',
      reason: 'success',
      status_code: 200,
      data: [
        {
          program_code: 'PC1',
          org_id: '123456_qwerty',
          error_code: [
            {
              code: 'E00_1',
              group: 'System',
              text: 'Unknow client program',
              description: 'The program code being used is not a valid code forthis client',
            },
            {
              code: 'E00_2',
              group: 'Entity',
              text: 'Offer not available for this entity type',
              description: 'The entity type: “organization” is not valid for this program for this client',
            },
          ],
          eligibility_status: true,
        },
      ],
      receipt: 'xyz',
      id: '1',
      status: 'ok',
    },
  } as ConstraintResponse,
};
