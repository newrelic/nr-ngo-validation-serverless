/* eslint-disable @typescript-eslint/naming-convention */
import { LookupLargeResponse } from '../../src/types/lookupLargeResponse';

export const LookupApiFixtires = {
  invalidLookupResponse: {
    returnStatus: {
      elapsed: '127.0 milliseconds',
      node: 'node',
      reason: 'success',
      status_code: 200,
      data: [],
      signature: 'VS_Large_Object_001',
      receipt: 'recipient',
      id: 'nodeid',
      status: 'ok',
    },
  } as LookupLargeResponse,
  validLookupApiResponse: {
    returnStatus: {
      elapsed: '127.0 milliseconds',
      node: 'node',
      reason: 'success',
      status_code: 200,
      data: [
        {
          financials: [
            {
              type: 'operatingBudget',
              version: 4,
              timestamp: 1600445838457,
              type_value: 100,
            },
          ],
          instance_code: '123qwe',
          version: 6,
          instance_handle: 'handle123',
          agents: [
            {
              expiration_date: 1605629838458,
              pin: '1234',
            },
          ],
          country_code: 'PL',
          instance_id: '12345_0000',
          org_id: '54321_0000',
          purposes: [
            {
              type: 'one',
              version: 19,
              timestamp: 1600445838563,
              type_value: 'X',
            },
            {
              type: 'two',
              version: 19,
              timestamp: 1600445838563,
              type_value: 'Y',
            },
            {
              type: 'three',
              version: 19,
              timestamp: 1600445838563,
              type_value: '100',
            },
            {
              type: 'four',
              version: 18,
              timestamp: 1600445838563,
              type_value: '125',
            },
          ],
          name: {
            type: 'legalName',
            version: 4,
            timestamp: 1600445838457,
            type_value: 'TEAM BobJohn',
          },
          locations: [
            {
              type: 'main',
              version: 5,
              timestamp: 1600445838458,
              address: '120 Mango St.',
              address_ext: 'nil',
              city: 'Krakow',
              state_region: 'M',
              postal_code: '65001',
              country_id: 'PL',
              latitude: 0,
              longitude: 0,
            },
            {
              type: 'legal',
              version: 2,
              timestamp: 1589473637773,
              address: '120 Mango St..',
              address_ext: 'nil',
              city: 'Krakow',
              state_region: 'M',
              postal_code: '65001',
              country_id: 'PL',
              latitude: 0,
              longitude: 0,
            },
          ],
          websites: [],
          legal_identifier: [
            {
              type: 'IDN',
              version: 4,
              timestamp: 1600445838458,
              type_value: '99-9999999',
            },
          ],
          descriptive_texts: [],
          status: {
            type: 'main',
            version: 17,
            timestamp: 1589474206397,
            type_value: 1,
          },
        },
      ],
      signature: 'VS_Large_Object_001',
      receipt: 'recipient',
      id: 'nodeid',
      status: 'ok',
    },
  } as LookupLargeResponse,
};
