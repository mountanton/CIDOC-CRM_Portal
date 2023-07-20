export interface GlobalSearchRequest {
  typeOfSearch: string; //property || class
  searchValue: string;
  limit: number;
  page: number;
  totalEntries: number;
}

export interface GlobalSearchResponse {
  dataset: string;
  triples:number
  requestSize: number;
}
