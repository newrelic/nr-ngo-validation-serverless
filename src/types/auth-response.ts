import myzod, { Infer } from "myzod";

export const AuthResponseStatementSchema = myzod
  .object({
    Action: myzod.string().default("execute-api:Invoke"),
    Effect: myzod.string().valid(["Allow", "Deny"]),
    Resource: myzod.string(),
  })
  .collectErrors();

export const AuthResponseSchema = myzod
  .object({
    principalId: myzod.string().default("user"),
    policyDocument: myzod.object({
      Version: myzod.string().default("2012-10-17"),
      Statement: myzod.array(AuthResponseStatementSchema),
    }),
  })
  .collectErrors();

export type AuthResponse = Infer<typeof AuthResponseSchema>;
export type Statement = Infer<typeof AuthResponseStatementSchema>;
