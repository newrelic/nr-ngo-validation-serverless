import { ConstraintApiErrorCodes, ConstraintErrorCodes } from '../types/constraintApiErrorCodes';

export const translateErrorMessages = (errorsFromResponse: string[]): ConstraintApiErrorCodes[] => {
  const errorCodes: ConstraintApiErrorCodes[] = [];

  for (const errorCode of errorsFromResponse) {
    const code = errorCode.toString();
    errorCodes.push(ConstraintErrorCodes[code]);
  }

  return errorCodes;
};
