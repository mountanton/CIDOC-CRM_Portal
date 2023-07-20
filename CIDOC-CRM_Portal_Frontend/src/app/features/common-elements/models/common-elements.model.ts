export interface CommonElementsRequest {
  endpoint1: string;
  endpoint2: string;
  onlyCIDOC: boolean;
  limit: number;
  page: number;
  totalEntries: number;
}

export interface CommonProperties {
  prop: string;
  requestSize: number;
}

export interface CommonRDFClasses {
  rdfClass: string;
  requestSize: number;
}
