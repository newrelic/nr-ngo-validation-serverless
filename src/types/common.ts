export interface ReturnStatus {
  node: string;
  reason: Reason;
  data: DataObject[];
  signature: string;
  id: string;
  status: string;
  status_code: number;
}

export enum Reason {
  Success = 'success',
  Failed = 'failed',
  MalformedRequest = 'malformed_request',
  NoPermission = 'no_permission',
  InvalidRolePermission = 'invalid_role_permission',
  InvalidSession = 'invalid_session',
  InvalidAuthentication = 'invalid_authentication',
  FailedAuthentication = 'failed_authentication',
  ResourceNotFound = 'resource_not_found',
  Timeout = 'timeout',
  SessionTimeout = 'session_timeout',
}

export enum StatusCodes {
  Ok = 'ok',
  Error = 'error',
  RequestProcessed = 'request_processed',
  RequestProcessing = 'request_processing',
  RequestReceived = 'request_received',
  InvalidParameter = 'invalid_parameter',
  InvalidParameters = 'invalid_parameters',
  MalformedObjectInRequest = 'malformed_object_in_request',
  MalformedRequest = 'malformed_request',
  InvalidRolePermission = 'invalid_role_permission',
  TimeoutOccurred = 'timeout_occurred',
  CommandNotEnabled = 'command_not_enabled',
  NotImplemented = 'not_implemented',
}

export enum ResponseType {
  Basic = 'BASIC',
  Full = 'FULL',
}

export interface Location {
  timestamp: number | string;
  version: string | number;
  type: string;
  address: string;
  address_ext?: string;
  city: string;
  state_region: string;
  postal_code: string;
  country_id: string;
  latitude: number;
  longitude: number;
}

export interface CommonObject {
  timestamp: number;
  version: string | number;
  type: string;
  type_value: string | number;
}

export interface DataObject {
  instance_code: string;
  version: string | number;
  instance_handle: string;
  country_code: string;
  instance_id: string;
  org_id: string;
  name: CommonObject;
  locations: Location[];
  websites: CommonObject[];
  legal_identifier: CommonObject[];
  status: CommonObject;
}

export interface AgentObject {
  expiration_date: number;
  pin: string;
}
