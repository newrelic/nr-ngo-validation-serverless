import { DescriptiveErrorCode } from './constraintApiErrorCodes';

export interface ConstraintResponse {
  returnStatus: ReturnStatus;
}

export interface ReturnStatus {
  reason: ReasonCode;
  data?: DataObject[];
  id?: string;
  status: StatusCode;
}

export interface DataObject {
  program_code: string;
  org_id: string;
  org_name?: string;
  error_code: ErrorCode;
  eligibility_status: boolean;
}

export type ErrorCode = DescriptiveErrorCode[] | string[];

export enum StatusCode {
  Ok = 'ok',
  Error = 'error',
}

export enum ReasonCode {
  Success = 'success',
  InvalidSession = 'invalid_session',
}

export enum ErrorCodes {
  UnknownClientProgram = 'E00_1',
  OfferNotAvailableForEntity = 'E00_2',
  EntityNotQualified = 'E00_3',
  EntityPendingQualification = 'E00_4',
  TimestampError = 'E00_5',
  OfferNotAvailableForLocation = 'E00_6',
  OfferNotAvailableForActivityCode = 'E00_7',
  OfferNotAvailableForBudget = 'E00_8',
  OrganizationNotFound = 'E00_11',
  AgentNotFound = 'E00_12',
}
