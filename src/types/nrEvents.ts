export type getLlrEvent = {
  func: string;
  orgId?: string;
};

export type getValidationHistoryEvent = {
  func: string;
  accountId?: string;
  orderBy?: string;
  orderAsc?: boolean | string;
  limit?: number | string;
  offset?: number | string;
  searchPhrase?: string;
  eventStartDate?: string;
  eventEndDate?: string;
};

export type manualApprovalEvent = {
  func: string;
  accountId?: string;
  validationSource?: string;
  description?: string;
  orgName?: string;
};

export type saveAttemptEvent = {
  func: string;
  accountId?: string;
  token?: string;
  eligibilityStatus?: boolean | string;
  orgId?: string;
  orgName?: string;
  reason?: string;
};

export type updateLlrEvent = {
  func: string;
  token?: string;
};

export type validateAccountEvent = {
  func: string;
  accountId?: string;
};

export type validateTokenEvent = {
  func: string;
  token?: string;
  accountId?: string;
};

export type validatorEvent = {
  func: string;
  token: string;
  session_key: string;
  constraint_id: string;
};
