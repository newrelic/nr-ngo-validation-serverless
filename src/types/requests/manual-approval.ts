import myzod, { Infer } from 'myzod';

export const manualApprovalSchema = myzod
  .object({
    accountId: myzod.string(),
    description: myzod.string(),
  })
  .collectErrors();

export type ManualApproval = Infer<typeof manualApprovalSchema>;
