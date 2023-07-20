import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { GlobalSearchRequest, GlobalSearchResponse } from "../model/global-search.model";
import { url } from "src/app/core/services/backend-url";

const BASE_URL = url;

@Injectable({
  providedIn: "root",
})
export class GlobalSearchService {
  private globalSearchRequestSubject$: BehaviorSubject<GlobalSearchRequest> =
    new BehaviorSubject(null);
  globalSearchRequest$ = this.globalSearchRequestSubject$.asObservable();
  constructor(private http: HttpClient) {}
  globalSearchRequest(req: GlobalSearchRequest) {
    if (req.typeOfSearch === "class") {
      return this.http.post<GlobalSearchResponse[]>(
        `${BASE_URL}class/global/search`,
        req
      );
    } else {
      return this.http.post<GlobalSearchResponse[]>(
        `${BASE_URL}property/global/search`,
        req
      );
    }
  }
  setGlobalSearchRequest(req: GlobalSearchRequest) {
    this.globalSearchRequestSubject$.next(req);
  }
}
