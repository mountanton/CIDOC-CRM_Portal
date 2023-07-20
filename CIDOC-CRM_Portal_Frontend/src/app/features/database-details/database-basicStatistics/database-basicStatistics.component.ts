import { Component, OnInit } from "@angular/core";
import { LoaderService } from "src/app/loader/loader.service";
import { InfoCardComponent } from "src/app/shared/standalone-components/info-card/info-card.component";
import { DatabaseDetailsService } from "../service/database-details.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { BasicStatistics } from "../models/dataset-details.model";
import { Dataset } from "src/app/core/models/dataset.model";
import { CommonModule } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  standalone: true,
  imports: [InfoCardComponent, CommonModule, MatDividerModule],
  selector: "app-database-basicStatistics",
  templateUrl: "./database-basicStatistics.component.html",
  styleUrls: ["./database-basicStatistics.component.scss"],
})
export class DatabaseBasicStatisticsComponent implements OnInit {
  subscriptions: Subscription = new Subscription();
  basicStatistics$: BehaviorSubject<BasicStatistics> = new BehaviorSubject(null);
  databaseDetails$: BehaviorSubject<Dataset> = new BehaviorSubject(null);
  databaseDetails: Dataset;
  constructor(
    public loaderService: LoaderService,
    private databaseDetailsServices: DatabaseDetailsService
  ) {}

  ngOnInit() {
    this.getDatasets();
    this.setBasicStatistics();
  }
  setBasicStatistics() {
    this.databaseDetailsServices
      .requestBasicStatistics(this.databaseDetails.endpoint)
      .subscribe((data) => {
        if (data) {
          this.basicStatistics$.next(data);
        }
      });
  }

  getDatasets() {
    this.subscriptions.add(
      this.databaseDetailsServices.databaseDetails$.subscribe((data) => {
        if (data) {
          this.databaseDetails = data;
          this.databaseDetails$.next(data);
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
