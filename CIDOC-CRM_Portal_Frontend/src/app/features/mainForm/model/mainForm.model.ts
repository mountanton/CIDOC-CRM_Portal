export interface RequestEmail {
  sendTo: string;
  subject: string;
  text: string;
}
export interface DatasetForm {
  datasetName: string;
  url: string;
  description: string;
  creator: string;
  numberOfTriples: number;
  numberOfEntities: number;
  numberOfProperties: number;
  numberOfClasses: number;
}
