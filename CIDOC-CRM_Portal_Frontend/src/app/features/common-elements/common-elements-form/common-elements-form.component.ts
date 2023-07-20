import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { LoaderService } from "src/app/loader/loader.service";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { InfoCardComponent } from "src/app/shared/standalone-components/info-card/info-card.component";
import { CommonElementsService } from "../service/common-elements.service";
import { AutocompleteComponent } from "src/app/shared/standalone-components/autocomplete/autocomplete.component";
import { CoreService } from "src/app/core/services/core.service";
import { Dataset } from "src/app/core/models/dataset.model";
import { Router } from "@angular/router";
import { DatabaseDetailsService } from "../../database-details/service/database-details.service";

@Component({
  standalone: true,
  imports: [MaterialFormModule, InfoCardComponent, AutocompleteComponent],
  selector: "app-common-elements-form",
  templateUrl: "./common-elements-form.component.html",
  styleUrls: ["./common-elements-form.component.scss"],
})
export class CommonElementsFormComponent implements OnInit {
  subscriptions: Subscription = new Subscription();
  datasets$: BehaviorSubject<Dataset[]> = new BehaviorSubject([]);
  datasets: Dataset[] = [];
  resetFirstFieldSubject$ = new Subject();
  resetSecondFieldSubject$ = new Subject();
  initDatasetAutocomplete$: BehaviorSubject<number> = new BehaviorSubject(0);
  disableEvent$: BehaviorSubject<string> = new BehaviorSubject("enable");
  form: UntypedFormGroup;
  inputAppearance = "outline";
  inputColor = "accent";
  knownFirstDataset: boolean = false;
  knownFirstDatasetID: number;

  constructor(
    private coreService: CoreService,
    private fb: UntypedFormBuilder,
    public loaderService: LoaderService,
    private commonElementsService: CommonElementsService,
    private router: Router,
    private databaseDetailsServices: DatabaseDetailsService
  ) {}

  ngOnInit() {
    if (this.router.url.includes("/dataset-details/")) {
      this.getDataset();
    }
    this.setDatasetsAutocomplete();
    this.initForm();
  }
  getDataset() {
    this.databaseDetailsServices.databaseDetails$.subscribe((data) => {
      if (data) {
        this.knownFirstDataset = true;
        this.knownFirstDatasetID = data.id;
      }
    });
  }
  setDatasetsAutocomplete() {
    this.subscriptions.add(
      this.coreService.datasets$.subscribe((data) => {
        if (data != null && data.length !== 0) {
          this.datasets = data;
          this.datasets$.next(data);
        }
      })
    );
  }

  initForm() {
    this.form = this.fb.group({
      endpoint1: new UntypedFormControl(null, Validators.required),
      endpoint2: new UntypedFormControl(null, Validators.required),
      onlyCIDOC: new UntypedFormControl(false, Validators.required),
      limit: new UntypedFormControl(10),
      page: new UntypedFormControl(0),
      totalEntries: new UntypedFormControl(0),
    });

    if (this.knownFirstDataset) {
      this.initDatasetAutocomplete$.next(this.knownFirstDatasetID);
      this.disableEvent$.next("disable");
      this.form
        .get("endpoint1")
        .setValue(
          this.datasets.find((data) => data.id === this.knownFirstDatasetID).endpoint
        );
    }
  }
  resetForm() {
    if (!this.knownFirstDataset) {
      this.resetFirstFieldSubject$.next(true);
      this.form.get("endpoint1").setValue(null);
    }
    this.resetSecondFieldSubject$.next(true);
    this.form.get("endpoint2").setValue(null);
    this.form.get("onlyCIDOC").setValue(false);
    this.form.get("limit").setValue(10);
    this.form.get("page").setValue(0);
    this.form.get("totalEntries").setValue(0);
  }
  setDatasetAutocomplete($event: Dataset, inputName: string) {
    if (!$event) {
      this.form.get(inputName).setValue(null);
    } else {
      this.form.get(inputName).setValue($event.endpoint);
    }
  }
  onSubmit() {
    this.form.get("totalEntries").setValue(0);
    this.commonElementsService.setRDFClassesRequest(this.form.value);
    this.form.get("totalEntries").setValue(0);
    this.commonElementsService.setPropertiesRequest(this.form.value);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
