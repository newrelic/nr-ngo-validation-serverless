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

type ValidationAttempt = {
  id: number;
  account_id: number;
  validation_date: Date;
  org_id: string;
  org_name: string;
  eligibility_status: string;
  reason: string;
  token: string;
};
