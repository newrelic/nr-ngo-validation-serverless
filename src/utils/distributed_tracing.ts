import Newrelic from "newrelic";
import { LambdaResponse } from "../types/response";

type CallbackFunction = () => Promise<LambdaResponse>;

export const handleDistributedTracing = async (
  traceName: string,
  func: CallbackFunction
): Promise<LambdaResponse> => {
  let res;
  await Newrelic.startWebTransaction(traceName, async function () {
    const transaction = Newrelic.getTransaction();
    res = await func();
    transaction.end();
  });
  return res;
};
