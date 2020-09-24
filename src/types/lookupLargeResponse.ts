import { CommonObject, DataObject, ReturnStatus } from './common';

export interface LookupLargeResponse {
  returnStatus: ReturnStatusExt;
}

export interface ReturnStatusExt extends ReturnStatus {
  data: DataObjectExt[];
}

export interface DataObjectExt extends DataObject {
  purposes: CommonObject[];
  descriptive_texts: CommonObject[];
}
