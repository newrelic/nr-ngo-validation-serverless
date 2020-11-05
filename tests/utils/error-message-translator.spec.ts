import { translateErrorMessages } from '../../src/utils/error-message-translator';
import { ConstraintTranslatedFixtures } from '../fixtures/errors-fixtures';

describe('Error message translator util', () => {
  it('If the error code array is empty, should return empty array', () => {
    const emptyErrorArray: string[] = [];
    expect(translateErrorMessages(emptyErrorArray)).toEqual(ConstraintTranslatedFixtures.emptyErrorCode);
  });

  it('Should return the single error message object', () => {
    const errorCode: string[] = ['E00_1'];
    expect(translateErrorMessages(errorCode)).toEqual(ConstraintTranslatedFixtures.oneErrorCode);
  });

  it('Should return list of two errors', () => {
    const errorCode: string[] = ['E00_1', 'E00_2'];
    expect(translateErrorMessages(errorCode)).toEqual(ConstraintTranslatedFixtures.twoErrorCodes);
  });

  it('Should return three errors, exactly translated, incoming list is unorder', () => {
    const errorCode: string[] = ['E00_2', 'E00_8', 'E00_5'];
    expect(translateErrorMessages(errorCode)).toEqual(ConstraintTranslatedFixtures.mixedErrorCodes);
  });
});
