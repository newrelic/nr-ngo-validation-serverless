import { DescriptiveErrorCode, ConstraintErrorCodes } from '../types/constraintApiErrorCodes';

export const translateErrorMessages = (errorsFromResponse: string[]): DescriptiveErrorCode[] => {
  const errorCodes: DescriptiveErrorCode[] = [];

  for (const errorCode of errorsFromResponse) {
    const code = errorCode.toString();
    errorCodes.push(ConstraintErrorCodes[code]);
  }

  return errorCodes;
};
