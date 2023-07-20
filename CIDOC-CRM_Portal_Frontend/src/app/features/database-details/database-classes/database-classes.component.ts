import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { MaterialMinModule } from "src/app/shared/material-min.module";
import { LoaderService } from "src/app/loader/loader.service";
import { RequestRDFClasses, RDFClass } from "../models/dataset-details.model";
import { Router } from "@angular/router";
import { DatabaseDetailsService } from "../service/database-details.service";
import { Dataset } from "src/app/core/models/dataset.model";

@Component({
  standalone: true,
  imports: [MaterialMinModule, MaterialFormModule],
  selector: "app-database-classes",
  templateUrl: "./database-classes.component.html",
  styleUrls: ["./database-classes.component.scss"],
})
export class DatabaseClassesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  myPaginator!: MatPaginator;
  rdfClassesRequest$: BehaviorSubject<RequestRDFClasses> = new BehaviorSubject(null);
  rdfClassesRequest: RequestRDFClasses;
  rdfClasses$: BehaviorSubject<RDFClass[]> = new BehaviorSubject(null);
  rdfClasses: RDFClass;
  error$: Observable<string | undefined>;
  displayError$: Observable<boolean>;
  subscriptions: Subscription = new Subscription();
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["id", "url", "triples"];
  onlyCidoc: boolean = false;
  databaseDetails$: BehaviorSubject<Dataset> = new BehaviorSubject(null);
  databaseDetails: Dataset;
  constructor(
    public loaderService: LoaderService,
    private router: Router,
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
  requestRDFClasses() {
    let propReq = {
      endpoint: this.databaseDetails.endpoint,
      onlyCidoc: this.onlyCidoc,
      limit: 10,
      page: 0,
      totalEntries: 0,
    };

    this.databaseDetailsServices.requestDatasetRDFClasses(propReq).subscribe((data) => {
      if (data) {
        this.rdfClasses$.next(data);
        if (propReq.totalEntries === 0) {
          propReq.totalEntries = data[0].requestSize;
          this.rdfClassesRequest$.next(propReq);
        }
      }
    });
    this.rdfClassesRequest$.next(propReq);
    this.subscriptions.add(
      this.rdfClassesRequest$.subscribe((data) => {
        if (data) {
          this.rdfClassesRequest = data;
        }
      })
    );
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.myPaginator = this.paginator;
      this.subscriptions.add(
        this.rdfClasses$.subscribe((data) => {
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
              this.rdfClassesRequest &&
              this.rdfClassesRequest.limit != this.myPaginator.pageSize
            ) {
              this.rdfClassesRequest.page = 0;
              this.paginator.pageIndex = 0;
            } else {
              this.rdfClassesRequest.page = pageNumber;
            }

            this.rdfClassesRequest.limit = this.myPaginator.pageSize;
            this.databaseDetailsServices
              .requestDatasetRDFClasses(this.rdfClassesRequest)
              .subscribe((data) => {
                this.rdfClasses$.next(data);
              });
            this.rdfClassesRequest$.next(this.rdfClassesRequest);
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
            this.requestRDFClasses();
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
