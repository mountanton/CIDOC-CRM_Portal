import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { InfoCardComponent } from "src/app/shared/standalone-components/info-card/info-card.component";
import { DatabaseDetailsService } from "../database-details/service/database-details.service";
import { AppColors } from "src/assets/app-colors";

@Component({
  standalone: true,
  imports: [InfoCardComponent, CommonModule],
  selector: "app-about-page",
  templateUrl: "./about-page.component.html",
  styleUrls: ["./about-page.component.scss"],
})
export class AboutPageComponent implements OnInit {
  localStorage: Storage = window.localStorage;
  color = AppColors.white;

  backgroundColorDark = AppColors.greenMain;
  backgroundColorLight = AppColors.greenMainLight;
  constructor() {}

  ngOnInit() {}
}
