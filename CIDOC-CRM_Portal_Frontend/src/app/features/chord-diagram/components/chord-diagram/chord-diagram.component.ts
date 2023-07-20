import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Output } from "@angular/core";
import { ChordDiagramViewModel } from "../../view-models/chord-diagram.viewmodel";
import { MaterialMinModule } from "src/app/shared/material-min.module";
import { DatabasesComponent } from "../databases/databases.component";
import { BehaviorSubject, Subscription } from "rxjs";
import { CoreService } from "src/app/core/services/core.service";
import { Dataset } from "src/app/core/models/dataset.model";
import { IDatabase } from "../../interfaces/database.interface";
import { SpinnerComponent } from "src/app/shared/standalone-components/spinner/spinner.component";
import { LoaderService } from "src/app/loader/loader.service";
import { BarChartModel } from "src/app/core/models/charts.model";
import { BarChartComponent } from "src/app/shared/standalone-components/bar-chart/bar-chart.component";
import { RoseDiagramComponent } from "src/app/shared/standalone-components/rose-diagram/rose-diagram.component";
import { MatTabsModule } from "@angular/material/tabs";
@Component({
  standalone: true,
  imports: [
    MaterialMinModule,
    DatabasesComponent,
    SpinnerComponent,
    RoseDiagramComponent,
    BarChartComponent,
    MatTabsModule,
  ],
  selector: "app-chord-diagram",
  templateUrl: "./chord-diagram.component.html",
  styleUrls: ["./chord-diagram.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChordDiagramComponent {
  @Output() eventDatasets = new EventEmitter<IDatabase[]>();
  @Output() showValue = new EventEmitter<string>();
  @Output() chartsTitle = new EventEmitter<string>();

  public chordDiagramVm: ChordDiagramViewModel;
  tabsInfo = [
    { value: "triples", viewValue: "Triples" },
    { value: "entities", viewValue: "Entities" },
    { value: "properties", viewValue: "Properties" },
    { value: "classes", viewValue: "Classes" },
    { value: "cidocProperties", viewValue: "CIDOC-CRM Properties" },
    { value: "cidocClasses", viewValue: "CIDOC-CRM Classes" },
    {
      value: "triplesWithCIDOCproperty",
      viewValue: "Triples With CIDOC-CRM Property",
    },
    {
      value: "triplesWithCIDOCpropertyPercentage",
      viewValue: "Triples With CIDOC-CRM Property Percentage",
    },
    { value: "triplesWithCIDOCinstance", viewValue: "Triples With CIDOC-CRM instance" },
    {
      value: "triplesWithCIDOCinstancePercentage",
      viewValue: "Triples With CIDOC-CRM Instance Percentage",
    },
  ];

  subscriptions: Subscription = new Subscription();
  datasetsStats: number[][] = [];
  datasetsInfoStats: IDatabase[] = [];
  letters = "0123456789ABCDEF";
  datasets: Dataset[];
  chartSelector: string = "default";
  currectSelectTitle: string = "triples";
  //BarChart
  barChartModel$: BehaviorSubject<BarChartModel[]> = new BehaviorSubject([]);
  barChartModel: BarChartModel;
  //RoseChart
  roseChartModel$: BehaviorSubject<BarChartModel[]> = new BehaviorSubject([]);
  roseChartModel: BarChartModel;
  titleOfGraphs: string;
  constructor(private coreService: CoreService, public loaderService: LoaderService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.coreService.datasets$.subscribe((data) => {
        if (data != null && data.length !== 0) {
          this.datasets = data;
          this.titleOfGraphs = "Triples";
          this.createCircle("triples");
          this.changeToggleValueChart("default");
          this.eventDatasets.emit(this.datasetsInfoStats);
        }
      })
    );
    //init rose diagram for default
  }
  createCircleData(datasets: Dataset[], title: string) {
    for (let i = 0; i < datasets.length; i++) {
      let arrayOfDatabase: number[] = [];
      for (let j = 0; j < datasets.length; j++) {
        if (i === j) {
          arrayOfDatabase.push(+datasets[j][title]);
        } else {
          arrayOfDatabase.push(0);
        }
      }
      this.datasetsStats.push(arrayOfDatabase);
    }
  }
  createTitleOfCircle(datasets: Dataset[]) {
    for (let i = 0; i < datasets.length; i++) {
      let databaseInfo: IDatabase = {} as IDatabase;
      for (const [key, value] of Object.entries(datasets[i])) {
        databaseInfo[key] = value;
      }
      databaseInfo.colour = this.getRandomColor();
      this.datasetsInfoStats.push(databaseInfo);
    }
  }
  generateCircle(matrix: number[][], groups: IDatabase[]) {
    this.chordDiagramVm = new ChordDiagramViewModel(
      matrix, //pinakas nxn stoixeia
      230, // megethos tou kuklo (aktina)
      groups // kathgories pou uparxoun(onomata database)
    );
  }
  getRandomColor(): string {
    let color = "#";
    for (var i = 0; i < 6; i++) {
      color += this.letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  seeDetails(datasetHref: string) {}

  createCircle(title: string) {
    this.datasetsStats = [];
    this.datasetsInfoStats = [];
    this.createCircleData(this.datasets, title);
    this.createTitleOfCircle(this.datasets);
    this.generateCircle(this.datasetsStats, this.datasetsInfoStats);
  }
  changeToggleValue(value: string) {
    this.titleOfGraphs = value;
    value = this.tabsInfo.find((data) => value === data.viewValue).value;
    this.currectSelectTitle = value;
    this.showValue.emit(value);
    if (this.chartSelector === "default") {
      this.roseChartModel$.next(this.fixChartData(this.currectSelectTitle));
    } else if (this.chartSelector === "bar") {
      this.barChartModel$.next(this.fixChartData(this.currectSelectTitle));
    } else {
      this.createCircle(value);
    }
  }
  changeToggleValueChart(value: string) {
    if (value === "bar") {
      this.barChartModel$.next(this.fixChartData(this.currectSelectTitle));
    } else if (value === "default") {
      this.roseChartModel$.next(this.fixChartData(this.currectSelectTitle));
    }
    this.chartSelector = value;
    this.chartsTitle.emit(value);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  //Chart
  fixChartData(title: string): BarChartModel[] {
    let dataChartModel: BarChartModel[] = [];
    this.datasets.forEach((data) => {
      let tmp: BarChartModel = {
        name: "",
        value: 0,
      };
      tmp.name = data.title;
      tmp.value = data[title];
      dataChartModel.push(tmp);
    });
    return dataChartModel;
  }
}
