export const ConstraintTranslatedFixtures = {
  emptyErrorCode: [] as string[],
  oneErrorCode: [
    {
      code: 'E00_1',
      group: 'System',
      text: 'Unknow client program',
      description: 'The program code being used is not a valid code forthis client',
    },
  ],
  twoErrorCodes: [
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
  mixedErrorCodes: [
    {
      code: 'E00_2',
      group: 'Entity',
      text: 'Offer not available for this entity type',
      description: 'The entity type: “organization” is not valid for this program for this client',
    },
    {
      code: 'E00_8',
      group: 'Program',
      text: 'Offer not available for this budget',
      description: 'The program code being used is not a valid code forthis client',
    },
    {
      code: 'E00_5',
      group: 'Program',
      text: 'Timestamp error',
      description: 'Time since previous qualification exceeds acceptable period for this program for this client',
    },
  ],
};
