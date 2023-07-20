import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { MaterialMinModule } from "src/app/shared/material-min.module";
import { LoaderService } from "src/app/loader/loader.service";
import { PropertiesRequest, Property } from "../models/dataset-details.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DatabaseDetailsService } from "../service/database-details.service";
import { CoreService } from "src/app/core/services/core.service";
import { Dataset } from "src/app/core/models/dataset.model";

@Component({
  standalone: true,
  imports: [MaterialMinModule, MaterialFormModule],
  selector: "app-database-properties",
  templateUrl: "./database-properties.component.html",
  styleUrls: ["./database-properties.component.scss"],
})
export class DatabasePropertiesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  myPaginator!: MatPaginator;
  propertiesRequest$: BehaviorSubject<PropertiesRequest> = new BehaviorSubject(null);
  propertiesRequest: PropertiesRequest;
  properties$: BehaviorSubject<Property[]> = new BehaviorSubject(null);
  properties: Property;
  error$: Observable<string | undefined>;
  displayError$: Observable<boolean>;
  subscriptions: Subscription = new Subscription();
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["id", "property", "triples"];
  onlyCidoc: boolean = false;
  databaseDetails$: BehaviorSubject<Dataset> = new BehaviorSubject(null);
  databaseDetails: Dataset;
  constructor(
    private coreService: CoreService,
    public loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private databaseDetailsServices: DatabaseDetailsService
  ) {
    if (this.router.url.includes("cidoc")) {
      this.onlyCidoc = true;
    }
  }

  ngOnInit() {
    this.getDatasets();
    this.setDatasetDetails();
  }
  requestProperties() {
    let propReq = {
      endpoint: this.databaseDetails.endpoint,
      onlyCidoc: this.onlyCidoc,
      limit: 10,
      page: 0,
      totalEntries: 0,
    };

    this.databaseDetailsServices.requestDatasetProperties(propReq).subscribe((data) => {
      if (data) {
        this.properties$.next(data);
        if (propReq.totalEntries === 0) {
          propReq.totalEntries = data[0].requestSize;
          this.propertiesRequest$.next(propReq);
        }
      }
    });
    this.propertiesRequest$.next(propReq);
    this.subscriptions.add(
      this.propertiesRequest$.subscribe((data) => {
        if (data) {
          this.propertiesRequest = data;
        }
      })
    );
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.myPaginator = this.paginator;
      this.subscriptions.add(
        this.properties$.subscribe((data) => {
          if (data != null) {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
          }
        })
      );
      this.subscriptions.add(
        this.myPaginator.page.subscribe((data) => {
          var pageNumber = data.pageIndex;
          setTimeout(() => {
            //if change page size then go back to first page
            if (
              this.propertiesRequest &&
              this.propertiesRequest.limit != this.myPaginator.pageSize
            ) {
              this.propertiesRequest.page = 0;
              this.paginator.pageIndex = 0;
            } else {
              this.propertiesRequest.page = pageNumber;
            }
            this.propertiesRequest.limit = this.myPaginator.pageSize;
            this.databaseDetailsServices
              .requestDatasetProperties(this.propertiesRequest)
              .subscribe((data) => {
                this.properties$.next(data);
              });
            this.propertiesRequest$.next(this.propertiesRequest);
          });
        })
      );
    });
  }

  getDatasets() {
    this.databaseDetailsServices.databaseDetails$.subscribe((data) => {
      if (data) {
        this.databaseDetails$.next(data);
      }
    });
  }

  setDatasetDetails() {
    this.subscriptions.add(
      this.databaseDetails$.subscribe((data) => {
        if (data) {
          this.databaseDetails = data;
          setTimeout(() => {
            this.requestProperties();
          });
        }
      })
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
