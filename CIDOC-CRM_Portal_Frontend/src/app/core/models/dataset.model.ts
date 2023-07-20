export interface Dataset {
  id?: number;
  title: string;
  endpoint: string;
  triples: number;
  entities: number;
  properties: number;
  classes: number;
  cidocProperties: number;
  cidocClasses: number;
  triplesWithCIDOCinstance: number;
  triplesWithCIDOCproperty: number;
  triplesWithCIDOCpropertyPercentage: number;
  triplesWithCIDOCinstancePercentage: number;
}
