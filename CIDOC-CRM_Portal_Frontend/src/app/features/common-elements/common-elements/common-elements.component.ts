import { Component, OnInit } from "@angular/core";
import { CommonElementsFormComponent } from "../common-elements-form/common-elements-form.component";
import { InfoCardComponent } from "src/app/shared/standalone-components/info-card/info-card.component";
import { AppColors } from "src/assets/app-colors";
import { CommonElementsService } from "../service/common-elements.service";
import { CommonModule } from "@angular/common";
import { CommonElementsPropertiesComponent } from "../common-elements-properties/common-elements-properties.component";
import { CommonElementsClassesComponent } from "../common-elements-classes/common-elements-classes.component";

@Component({
  standalone: true,
  imports: [
    CommonElementsPropertiesComponent,
    CommonElementsClassesComponent,
    CommonElementsFormComponent,
    InfoCardComponent,
    CommonModule,
  ],
  selector: "app-common-elements",
  templateUrl: "./common-elements.component.html",
  styleUrls: ["./common-elements.component.scss"],
})
export class CommonElementsComponent implements OnInit {
  localStorage: Storage = window.localStorage;
  color = AppColors.white;
  backgroundColorDark = AppColors.greenMain;
  backgroundColorLight = AppColors.greenMainLight;
  constructor(public commonElementsService: CommonElementsService) {}

  ngOnInit() {}
  ngOnDestroy() {
    this.commonElementsService.setPropertiesRequest(null);
    this.commonElementsService.setRDFClassesRequest(null);
  }
}
