/* eslint-disable @typescript-eslint/naming-convention */
import { AgentObject, CommonObject, DataObject, ReturnStatus } from './common';

export interface LookupLargeResponse {
  returnStatus: ReturnStatusExt;
}

export interface ReturnStatusExt extends ReturnStatus {
  data: DataObjectExt[];
}

export interface DataObjectExt extends DataObject {
  purposes: CommonObject[];
  financials: CommonObject[];
  agents: AgentObject[];
  descriptive_texts: CommonObject[];
}
