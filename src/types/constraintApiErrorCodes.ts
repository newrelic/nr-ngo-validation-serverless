type ConstraintErrorCodes = {
  [code: string]: DescriptiveErrorCode;
};

export type DescriptiveErrorCode = {
  code: string;
  group: string;
  text: string;
  description: string;
};

export const ConstraintErrorCodes: ConstraintErrorCodes = {
  E00_1: {
    code: 'E00_1',
    group: 'System',
    text: 'Unknow client program',
    description: 'The program code being used is not a valid code forthis client',
  },
  E00_2: {
    code: 'E00_2',
    group: 'Entity',
    text: 'Offer not available for this entity type',
    description: 'The entity type: “organization” is not valid for this program for this client',
  },
  E00_3: {
    code: 'E00_3',
    group: 'Entity',
    text: 'Entity not qualified',
    description: 'The validation process is complete and the status for this entity is “Not Qualified”',
  },
  E00_4: {
    code: 'E00_4',
    group: 'Entity',
    text: 'Entity pending qualification',
    description: 'Registration has been completed and the organization is in the process of being validated',
  },
  E00_5: {
    code: 'E00_5',
    group: 'Program',
    text: 'Timestamp error',
    description: 'Time since previous qualification exceeds acceptable period for this program for this client',
  },
  E00_6: {
    code: 'E00_6',
    group: 'Program',
    text: 'Offer not available for this location',
    description:
      'The primary location for this organization is outside acceptable bands for this program for this client',
  },
  E00_7: {
    code: 'E00_7',
    group: 'Program',
    text: 'Offer not available for this activity code',
    description:
      'The activity code(s) (primary and/or secondary) for this organization are outside acceptable bands for this program for this client',
  },
  E00_8: {
    code: 'E00_8',
    group: 'Program',
    text: 'Offer not available for this budget',
    description: 'The program code being used is not a valid code forthis client',
  },
  E00_9: {
    code: 'E00_9',
    group: '',
    text: '',
    description: '',
  },
  E00_10: {
    code: 'E00_10',
    group: '',
    text: '',
    description: '',
  },
  E00_11: {
    code: 'E00_11',
    group: 'System',
    text: 'Organization not found',
    description: 'The organization can not be found using provided data point(s)',
  },
  E00_12: {
    code: 'E00_12',
    group: 'System',
    text: 'Agent not found',
    description: 'The agent trying to act on behalf of the organization is not associated with the organization',
  },
  E00_13: {
    code: 'E00_13',
    group: '',
    text: '',
    description: '',
  },
  E00_14: {
    code: 'E00_14',
    group: '',
    text: '',
    description: '',
  },
  E00_15: {
    code: 'E00_15',
    group: '',
    text: '',
    description: '',
  },
};
