import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { UntypedFormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MaterialFormModule } from "../../material-form.module";

@Component({
  standalone: true,
  imports: [MaterialFormModule],
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  @Input() label: string = "Autocomplete";
  @Input() placeHolder: string = "Choose value";
  @Input() displayName: string;
  @Input() displayID: number | string;
  @Input() initID: number | string = null;
  @Input() changeInitIDToString: boolean = false; // if you want change the initID to be string
  @Input() resetEvent$: Observable<void>;
  @Input() disableEvent$: Observable<string>;
  @Input() hiddenValuesEvent$: Observable<number[] | string[]>;
  @Input() hiddenValuesEvent: any[] = [];
  @Input() requiredInput: boolean = false;
  @Input() disableInput: boolean = false;
  @Input() inputAppearance: string = "outline";
  @Input() inputColor: string = "accent";
  @Input() list$: Observable<any[]>;
  @Input() inputClass = "";
  @Input() autocompleteWithDisplayName: boolean = false;
  @Input() emitStringValue: boolean = false;

  @Output() autocompleteValue = new EventEmitter<any | null>();
  list: any[];
  eventsSubscription: Subscription = new Subscription();
  subscriptions: Subscription = new Subscription();
  autocompleteList$: Observable<any>;
  autocompleteSelectedValue: any = null;
  autocompleteFormControl = new UntypedFormControl("");
  constructor() {}

  ngOnInit() {
    if (this.resetEvent$ !== undefined) {
      this.eventsSubscription.add(
        this.resetEvent$.subscribe(() => this.resetAutocomplete())
      );
    }
    if (this.disableEvent$ !== undefined) {
      this.eventsSubscription.add(
        this.disableEvent$.subscribe((data) => {
          this.handleDisableFormControl(data);
        })
      );
    }
    if (this.hiddenValuesEvent$ !== undefined) {
      this.eventsSubscription.add(
        this.hiddenValuesEvent$.subscribe((data) => {
          this.hiddenValuesEvent = data;
        })
      );
    }
    this.initAutocomplete();
    if (this.requiredInput) {
      this.autocompleteFormControl.setValidators([Validators.required]);
    }
    if (this.disableInput) {
      this.autocompleteFormControl.disable();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["initID"] &&
      !changes["initID"].firstChange &&
      changes["initID"].currentValue != changes["initID"].previousValue
    ) {
      if (!this.changeInitIDToString) {
        this.initID = +this.initID;
      }
      if (this.list !== undefined) {
        this.initAutocompleteValue(this.initID);
      }
    }

    if (
      changes["disableInput"] &&
      !changes["disableInput"].firstChange &&
      changes["disableInput"].currentValue != changes["disableInput"].previousValue
    ) {
      if (this.disableInput) {
        this.autocompleteFormControl.disable();
      }
    }
  }
  handleDisableFormControl(data: string) {
    if (data === "disable") {
      this.autocompleteFormControl.disable();
    } else if (data === "enable") {
      this.autocompleteFormControl.enable();
    }
  }
  handleHiddenValues(autocompleteID: number | string) {
    if (this.changeInitIDToString) {
      if (
        this.hiddenValuesEvent.find(
          (data: string) => data.toLowerCase() === autocompleteID.toString().toLowerCase()
        ) === undefined
      ) {
        return false;
      }
    } else {
      if (
        this.hiddenValuesEvent.find((data: number) => data === autocompleteID) ===
        undefined
      ) {
        return false;
      }
    }
    return true;
  }
  onChangeAutocomplete() {
    this.autocompleteSelectedValue = this.autocompleteFormControl.value;
    this.autocompleteValue.emit(this.autocompleteFormControl.value);
  }
  initAutocomplete() {
    this.subscriptions.add(
      this.list$.subscribe((data) => {
        if (data !== undefined && data !== null && data.length !== 0) {
          this.list = data;
          this.autocompleteList$ = this.autocompleteFormControl.valueChanges.pipe(
            startWith(""),
            map((value: string) => {
              if (this.autocompleteWithDisplayName) {
                return this._filterAutocompleteWithDisplayName(value || "");
              } else {
                return this._filterAutocomplete(value || "");
              }
            })
          );
          if (!this.changeInitIDToString) {
            this.initID = +this.initID;
            if (this.initID !== 0) {
              this.initAutocompleteValue(this.initID);
            }
          } else {
            if (this.initID !== "") {
              this.initAutocompleteValue(this.initID);
            }
          }
        }
      })
    );
  }
  resetAutocomplete() {
    this.autocompleteFormControl.reset();
  }
  removeAutocompleteValue() {
    if (this.emitStringValue) {
      this.autocompleteValue.emit(this.autocompleteFormControl.value);
    } else {
      this.autocompleteValue.emit(null);
    }
  }
  displayWithName(value: any) {
    if (value) {
      return value[this.displayName];
    } else {
      return null;
    }
  }
  initAutocompleteValue(id: number | string) {
    let found: boolean = false;
    this.list.forEach((option) => {
      if (option[this.displayID] === id) {
        found = true;
        this.autocompleteFormControl.setValue(option);
      } else if (
        this.changeInitIDToString &&
        option[this.displayID].toLowerCase() === id.toString().toLowerCase()
      ) {
        found = true;
        this.autocompleteFormControl.setValue(option);
      }
    });
    if (!found) {
      this.autocompleteFormControl.setValue(null);
    }
  }
  private _filterAutocomplete(value: string): any[] {
    if (typeof value === "string") {
      const filterValue = value.toLowerCase();
      return this.list.filter((option) => {
        for (const [key, value] of Object.entries(option)) {
          if (value && value.toString().toLowerCase().includes(filterValue)) {
            return true;
          }
        }
        return false;
      });
    }
    return [];
  }
  private _filterAutocompleteWithDisplayName(value: string): any[] {
    if (typeof value === "string") {
      const filterValue = value.toLowerCase();
      return this.list.filter((option) => {
        if (option[this.displayName].toString().toLowerCase().includes(filterValue)) {
          return true;
        }
        return false;
      });
    }
    return [];
  }
  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }
}
