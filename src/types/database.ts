export type DatabaseContext = {
  resourceArn: string;
  secretArn: string;
  database: string;
};

export type ValidationAttemptsRecord = {
  id: number;
  account_id: number;
  validation_date: Date;
  org_id: string;
  org_name: string;
  eligibility_status: string;
  reason: string;
  token: string;
};
