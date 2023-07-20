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
import { AutocompleteComponent } from "src/app/shared/standalone-components/autocomplete/autocomplete.component";
import { CoreService } from "src/app/core/services/core.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalSearchService } from "../service/global-search.service";
import { AutocompleteClassProperty } from "src/app/core/models/autocomplete.model";

@Component({
  standalone: true,
  imports: [MaterialFormModule, InfoCardComponent, AutocompleteComponent],
  selector: "app-global-search-form",
  templateUrl: "./global-search-form.component.html",
  styleUrls: ["./global-search-form.component.scss"],
})
export class GlobalSearchFormComponent implements OnInit {
  subscriptions: Subscription = new Subscription();
  autocompleteClassess$: BehaviorSubject<AutocompleteClassProperty[]> =
    new BehaviorSubject([]);
  autocompleteProperties$: BehaviorSubject<AutocompleteClassProperty[]> =
    new BehaviorSubject([]);
  resetPropertySubject$ = new Subject();
  resetClassSubject$ = new Subject();

  form: UntypedFormGroup;
  inputAppearance = "outline";
  inputColor = "accent";
  knownFirstDataset: boolean = false;
  knownFirstDatasetID: number;

  constructor(
    private coreService: CoreService,
    private fb: UntypedFormBuilder,
    public loaderService: LoaderService,
    private globalSearchService: GlobalSearchService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (router.url.includes("/dataset-details/")) {
      this.knownFirstDataset = true;
      this.knownFirstDatasetID = +this.route.snapshot.params["id"];
    }
  }

  ngOnInit() {
    this.setAutocompleteClassProperties();
    this.initForm();
  }
  setAutocompleteClassProperties() {
    this.subscriptions.add(
      this.coreService.autocompleteClassProperties$.subscribe((data) => {
        if (data != null) {
          data.autocompleteClass = data.autocompleteClass.sort(this.compare);
          data.autocompleteProperty = data.autocompleteProperty.sort(this.compare);
          this.autocompleteClassess$.next(data.autocompleteClass);
          this.autocompleteProperties$.next(data.autocompleteProperty);
        }
      })
    );
  }

  initForm() {
    this.form = this.fb.group({
      typeOfSearch: new UntypedFormControl(null),
      searchValue: new UntypedFormControl(null, Validators.required),
      limit: new UntypedFormControl(10),
      page: new UntypedFormControl(0),
      totalEntries: new UntypedFormControl(0),
    });
  }
  resetForm() {
    this.resetClassSubject$.next(true);
    this.resetPropertySubject$.next(true);
    this.form.reset();
    this.form.get("limit").setValue(10);
    this.form.get("page").setValue(0);
    this.form.get("totalEntries").setValue(0);
  }
  setAutocompleteProperty($event: AutocompleteClassProperty | string) {
    if (typeof $event === "string") {
      this.form.get("searchValue").setValue($event);
    } else {
      this.form.get("searchValue").setValue($event.autocompleteValue);
    }
    this.form.get("typeOfSearch").setValue("property");
    this.resetClassSubject$.next(true);
  }
  setAutocompleteClass($event: AutocompleteClassProperty) {
    if (typeof $event === "string") {
      this.form.get("searchValue").setValue($event);
    } else {
      this.form.get("searchValue").setValue($event.autocompleteValue);
    }
    this.form.get("typeOfSearch").setValue("class");
    this.resetPropertySubject$.next(true);
  }
  onSubmit() {
    this.form.get("totalEntries").setValue(0);
    this.globalSearchService.setGlobalSearchRequest(this.form.value);
  }
  compare(a, b) {
    const aNum = Number(a.autocompleteViewValue.substring(1).split(" ")[0].match(/\d+/));
    const bNum = Number(b.autocompleteViewValue.substring(1).split(" ")[0].match(/\d+/));
    return aNum - bNum;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
