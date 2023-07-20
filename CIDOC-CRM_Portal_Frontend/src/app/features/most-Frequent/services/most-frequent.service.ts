import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { url } from "src/app/core/services/backend-url";
import {
  MostFrequentRequest,
  MostFrequentWithTotalSizeResponse,
} from "../models/most-frequent.model";

const BASE_URL = url;

@Injectable({
  providedIn: "root",
})
export class MostFrequentService {
  constructor(private http: HttpClient) {}

  mostFrequentPropertiesORClass(req: MostFrequentRequest) {
    return this.http.post<MostFrequentWithTotalSizeResponse>(
      `${BASE_URL}mostFrequent`,
      req
    );
  }
}
