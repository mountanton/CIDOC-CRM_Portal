export interface IDatabase {
  id?: number;
  title?: string;
  endpoint?: string;
  triples?: number;
  colour: string;
  entities?: number;
  properties?: number;
  classes?: number;
  cidocProperties?: number;
  cidocClasses?: number;
  triplesWithCIDOCinstance?: number;
  triplesWithCIDOCproperty?: number;
  triplesWithCIDOCpropertyPercentage?: number;
  triplesWithCIDOCinstancePercentage?: number;
}
