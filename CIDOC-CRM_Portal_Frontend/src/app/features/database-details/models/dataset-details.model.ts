export interface Property {
  id: number;
  prop: string;
  triples: number;
  requestSize: number;
}
export interface PropertiesRequest {
  endpoint: string;
  onlyCidoc: boolean;
  limit: number;
  page: number;
}
//classes
export interface RequestRDFClasses {
  endpoint: string;
  onlyCidoc: boolean;
  limit: number;
  page: number;
}
export interface RDFClass {
  id: number;
  url: string;
  triples: number;
  requestSize: number;
}
//
export interface BasicStatistics {
  triples: number;
  entities: number;
  description: string;
  properties: number;
  classes: number;
  title: string;
  triplesWithCIDOCproperty: number;
  triplesWithCIDOCpropertyPercentage: number;
  triplesWithCIDOCinstance: number;
  triplesWithCIDOCinstancePercentage: number;
  propertiesCIDOC: number;
  classesCIDOC: number;
}
