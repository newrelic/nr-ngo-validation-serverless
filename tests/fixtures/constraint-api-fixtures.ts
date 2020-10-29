/* eslint-disable @typescript-eslint/naming-convention */
import { ConstraintResponse } from '../../src/types/constraintResponse';

export const ConstraintApiFixtures = {
  allPassResponse: {
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
  tokenExpiredResponse: {
    returnStatus: {
      elapsed: '79.0 milliseconds',
      node: 'node2',
      reason: 'success',
      status_code: 200,
      data: [
        {
          program_code: 'PC1',
          org_id: '123456_asdfgh',
          error_code: [],
          eligibility_status: true,
        },
      ],
      receipt: 'abc',
      id: '2',
      status: 'ok',
    },
  } as ConstraintResponse,
  organizationStatusFailed: {
    returnStatus: {
      elapsed: '89.0 milliseconds',
      node: 'node3',
      reason: 'success',
      status_code: 200,
      data: [
        {
          program_code: 'PC1',
          org_id: '123456_zxcvbn',
          error_code: ['E00_3'],
          eligibility_status: false,
        },
      ],
      receipt: 'zxc',
      id: '3',
      status: 'ok',
    },
  } as ConstraintResponse,
  eligibilityStatusFalse: {
    returnStatus: {
      elapsed: '80.0 milliseconds',
      node: 'node4',
      reason: 'success',
      status_code: 200,
      data: [
        {
          program_code: 'PC1',
          org_id: '123456_qazwsx',
          error_code: ['E00_7'],
          eligibility_status: false,
        },
      ],
      receipt: 'qwe',
      id: '4',
      status: 'ok',
    },
  } as ConstraintResponse,
};
