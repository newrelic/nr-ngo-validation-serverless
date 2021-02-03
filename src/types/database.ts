export type SaveAttemptBody = {
  accountId: string;
  token: string;
  orgId: string;
  eligibilityStatus: boolean;
  orgName: string;
  reason?: string;
};

export type DatabaseContext = {
  resourceArn: string;
  secretArn: string;
  database: string;
};

export type ValidationAttempts = {
  records: Array<ValidationAttempt>;
};

export type ValidationHistoryRequest = {
  accountId?: string;
  searchPhrase?: string;
  orderBy?: string;
  orderAsc?: boolean;
  limit?: number;
  offset?: number;
  startDate: Date;
  endDate: Date;
};

export type ValidationHistoryResponse = {
  attempts: Array<ValidationAttempt>;
  records: number;
};

export type ValidationCount = {
  records: Array<Count>;
};

type Count = {
  count: number;
};

type ValidationAttempt = {
  id: number;
  account_id: string;
  validation_date: Date;
  org_id: string;
  org_name: string;
  eligibility_status: string;
  reason: string;
  token: string;
};
