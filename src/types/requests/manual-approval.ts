import myzod, { Infer } from 'myzod';

export const manualApprovalSchema = myzod
  .object({
    accountId: myzod.string(),
    validationSource: myzod.string(),
    description: myzod.string(),
  })
  .collectErrors();

export type ManualApprovalRequest = Infer<typeof manualApprovalSchema>;
