import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LoaderService } from "src/app/loader/loader.service";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { InfoCardComponent } from "src/app/shared/standalone-components/info-card/info-card.component";
import { SpinnerComponent } from "src/app/shared/standalone-components/spinner/spinner.component";
import { AppColors } from "src/assets/app-colors";
import { MainFormService } from "./service/mainForm.service";
import { RequestEmail } from "./model/mainForm.model";
@Component({
  standalone: true,
  imports: [MaterialFormModule, InfoCardComponent, SpinnerComponent],
  selector: "app-mainForm",
  templateUrl: "./mainForm.component.html",
  styleUrls: ["./mainForm.component.scss"],
})
export class MainFormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  title = "Add Dataset";
  form: UntypedFormGroup;
  color = AppColors.white;
  inputAppearance = "outline";
  inputColor = "accent";
  localStorage: Storage = window.localStorage;
  backgroundColorDark = AppColors.greenMain;
  backgroundColorLight = AppColors.greenMainLight;
  successMessage: boolean;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private mainFormService: MainFormService,
    public loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      datasetName: new UntypedFormControl(null, Validators.required),
      url: new UntypedFormControl(null, Validators.required),
      creator: new UntypedFormControl(null, Validators.required),
      description: new UntypedFormControl(null, Validators.required),
      email: new UntypedFormControl(null, Validators.required),
      numberOfTriples: new UntypedFormControl(null),
      numberOfEntities: new UntypedFormControl(null),
      numberOfProperties: new UntypedFormControl(null),
      numberOfClasses: new UntypedFormControl(null),
    });
  }

  backToList() {
    this.router.navigate([""]);
  }

  resetForm() {
    this.form.reset();
  }

  onSubmit() {
    this.successMessage = false;
    let requestEmail: RequestEmail = {
      sendTo: "cidoc.crm@gmail.com",
      subject: "Add New Dataset",
      text: JSON.stringify(this.form.value),
    };
    this.subscriptions.add(
      this.mainFormService.addDataset(requestEmail).subscribe((data) => {
        if (data) {
          this.successMessage = true;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
