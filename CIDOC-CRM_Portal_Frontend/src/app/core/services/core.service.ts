import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Dataset } from "../models/dataset.model";
import { BehaviorSubject } from "rxjs";
import { AutocompleteClassPropertyLists } from "../models/autocomplete.model";
import { url } from "src/app/core/services/backend-url";
const BASE_URL = url;

@Injectable({
  providedIn: "root",
})
export class CoreService {
  private datasetsSubject$: BehaviorSubject<Dataset[]> = new BehaviorSubject([]);
  datasets$ = this.datasetsSubject$.asObservable();
  constructor(private http: HttpClient) {
    if (localStorage.getItem("Datasets")) {
      let datasetslocalStorage = JSON.parse(localStorage.getItem("Datasets"));
      this.datasetsSubject$.next(datasetslocalStorage);
    } else {
      this.datasetsSubject$.next([]);
    }
    if (localStorage.getItem("AutocompleteClassProperty")) {
      let autocompleteClassPropertylocalStorage = JSON.parse(
        localStorage.getItem("AutocompleteClassProperty")
      );
      this.autocompleteClassPropertiesSubject$.next(
        autocompleteClassPropertylocalStorage
      );
    } else {
      this.autocompleteClassPropertiesSubject$.next(null);
    }
  }

  requestDatasets() {
    return this.http.get<Dataset[]>(`${BASE_URL}datasets`);
  }

  localStorageDatasets() {
    return localStorage.getItem("Datasets");
  }

  setDatasets(datasets: Dataset[]) {
    localStorage.setItem("Datasets", JSON.stringify(datasets));
    this.datasetsSubject$.next(datasets);
  }

  clearDatasets() {
    localStorage.removeItem("Datasets");
    this.datasetsSubject$.next([]);
  }
  //AUTOCOMPLETEPROPERTIES
  private autocompleteClassPropertiesSubject$: BehaviorSubject<AutocompleteClassPropertyLists> =
    new BehaviorSubject(null);
  autocompleteClassProperties$ = this.autocompleteClassPropertiesSubject$.asObservable();

  requestAutocompleteClassProperty() {
    return this.http.get<AutocompleteClassPropertyLists>(
      `${BASE_URL}autocomplete/properties/classes`
    );
  }

  localStorageAutocompleteClassProperty() {
    return localStorage.getItem("AutocompleteClassProperty");
  }

  setAutocompleteClassProperty(
    autocompleteClassProperty: AutocompleteClassPropertyLists
  ) {
    localStorage.setItem(
      "AutocompleteClassProperty",
      JSON.stringify(autocompleteClassProperty)
    );
    this.autocompleteClassPropertiesSubject$.next(autocompleteClassProperty);
  }

  clearAutocompleteClassProperty() {
    localStorage.removeItem("AutocompleteClassProperty");
    this.autocompleteClassPropertiesSubject$.next(null);
  }
}
