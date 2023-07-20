import { Component, OnDestroy, OnInit } from "@angular/core";
import { RoseDiagramComponent } from "src/app/shared/standalone-components/rose-diagram/rose-diagram.component";
import { GlobalSearchRequest, GlobalSearchResponse } from "../model/global-search.model";
import { BarChartModel } from "src/app/core/models/charts.model";
import { BehaviorSubject, Subscription } from "rxjs";
import { Dataset } from "src/app/core/models/dataset.model";
import { LoaderService } from "src/app/loader/loader.service";
import { GlobalSearchService } from "../service/global-search.service";
import { CoreService } from "src/app/core/services/core.service";

@Component({
  standalone: true,
  imports: [RoseDiagramComponent],
  selector: "app-global-search-rose-chart",
  templateUrl: "./global-search-rose-chart.component.html",
  styleUrls: ["./global-search-rose-chart.component.scss"],
})
export class GlobalSearchRoseChartComponent implements OnInit, OnDestroy {
  globalSearchRequest$: BehaviorSubject<GlobalSearchRequest> = new BehaviorSubject(null);
  globalSearchRequest: GlobalSearchRequest;
  barChartModel$: BehaviorSubject<BarChartModel[]> = new BehaviorSubject([]);
  barChartModel: BarChartModel;
  subscriptions: Subscription = new Subscription();
  databaseDetails$: BehaviorSubject<Dataset> = new BehaviorSubject(null);
  databaseDetails: Dataset;
  datasets: Dataset[];
  chartData: any[] = [];
  constructor(
    public loaderService: LoaderService,
    private globalSearchService: GlobalSearchService,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    this.allDatasets();
    this.setRequest();
    this.requestGlobalSearch();
  }
  allDatasets() {
    this.subscriptions.add(
      this.coreService.datasets$.subscribe((data) => {
        if (data != null && data.length !== 0) {
          this.datasets = data;
        }
      })
    );
  }
  setRequest() {
    this.subscriptions.add(
      this.globalSearchService.globalSearchRequest$.subscribe((data) => {
        if (data) {
          this.globalSearchRequest = data;
          this.globalSearchRequest = { ...this.globalSearchRequest, limit: 50, page: 0 };
          this.globalSearchRequest$.next(this.globalSearchRequest);
        }
      })
    );
  }

  requestGlobalSearch() {
    this.subscriptions.add(
      this.globalSearchRequest$.subscribe((data1) => {
        this.subscriptions.add(
          this.globalSearchService
            .globalSearchRequest(this.globalSearchRequest)
            .subscribe((data) => {
              if (data) {
                let dataWithTitle = this.transformDataWithTitle(data);
                this.chartData = this.fixChartData(dataWithTitle);
                this.barChartModel$.next(this.chartData);
              }
            })
        );
      })
    );
  }
  transformDataWithTitle(arrayData: any[]) {
    for (let i = 0; i < arrayData.length; i++) {
      for (let j = 0; j < this.datasets.length; j++) {
        if (this.datasets[j].endpoint === arrayData[i].dataset) {
          arrayData[i] = { ...arrayData[i], title: this.datasets[j].title };
        }
      }
    }
    return arrayData;
  }
  fixChartData(datas: any[]): BarChartModel[] {
    let dataChartModel: BarChartModel[] = [];
    datas.forEach((data) => {
      let tmp: BarChartModel = {
        name: "",
        value: 0,
      };
      tmp.name = data.title;
      tmp.value = data.triples;
      dataChartModel.push(tmp);
    });
    return dataChartModel;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
