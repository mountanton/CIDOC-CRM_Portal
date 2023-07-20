import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { InfoCardComponent } from "src/app/shared/standalone-components/info-card/info-card.component";
import { TabMenuComponent } from "src/app/shared/standalone-components/tab-menu/tab-menu.component";
import { BehaviorSubject, Subscription } from "rxjs";
import { AppColors } from "src/assets/app-colors";
import { MostFrequentService } from "../services/most-frequent.service";

@Component({
  standalone: true,
  imports: [InfoCardComponent, TabMenuComponent, RouterOutlet, CommonModule],
  selector: "app-most-frequent",
  templateUrl: "./most-frequent.component.html",
  styleUrls: ["./most-frequent.component.scss"],
})
export class MostFrequentComponent implements OnInit {
  localStorage: Storage = window.localStorage;
  // subscriptions: Subscription = new Subscription();
  color = AppColors.white;
  backgroundColorDark = AppColors.greenMain;
  backgroundColorLight = AppColors.greenMainLight;
  tab = [
    {
      label: "Properties (datasets)",
      title: "Properties (datasets)",
      path: "./properties",
    },
    {
      label: "CIDOC-CRM Properties (datasets)",
      title: "CIDOC-CRM Properties (datasets)",
      path: "./properties/cidoc-crm",
    },
    {
      label: "Properties (triples)",
      title: "Properties (triples)",
      path: "./properties/instances",
    },
    {
      label: "CIDOC-CRM Properties (triples)",
      title: "CIDOC-CRM Properties (triples)",
      path: "./properties/cidoc-crm/instances",
    },
    {
      label: "Classes (datasets)",
      title: "Classes (datasets)",
      path: "./classes",
    },
    {
      label: "CIDOC-CRM Classes (datasets)",
      title: "CIDOC-CRM Classes (datasets)",
      path: "./classes/cidoc-crm",
    },
    {
      label: "Classes (triples)",
      title: "Classes (triples)",
      path: "./classes/instances",
    },
    {
      label: "CIDOC-CRM Classes (triples)",
      title: "CIDOC-CRM Classes (triples)",
      path: "./classes/cidoc-crm/instances",
    },
  ];
  constructor(private mostFrequentService: MostFrequentService) {}

  ngOnInit() {}
}
