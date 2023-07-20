import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { MaterialMinModule } from "src/app/shared/material-min.module";
import { LoaderService } from "src/app/loader/loader.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Dataset } from "src/app/core/models/dataset.model";
import { CommonElementsRequest, CommonProperties } from "../models/common-elements.model";
import { CommonElementsService } from "../service/common-elements.service";

@Component({
  standalone: true,
  imports: [MaterialMinModule, MaterialFormModule],
  selector: "app-common-elements-properties",
  templateUrl: "./common-elements-properties.component.html",
  styleUrls: ["./common-elements-properties.component.scss"],
})
export class CommonElementsPropertiesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  myPaginator!: MatPaginator;
  commonPropertiesRequest$: BehaviorSubject<CommonElementsRequest> = new BehaviorSubject(
    null
  );
  commonPropertiesRequest: CommonElementsRequest;
  commonProperties$: BehaviorSubject<CommonProperties[]> = new BehaviorSubject(null);
  commonProperties: CommonProperties;
  error$: Observable<string | undefined>;
  displayError$: Observable<boolean>;
  subscriptions: Subscription = new Subscription();
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["prop"];
  databaseDetails$: BehaviorSubject<Dataset> = new BehaviorSubject(null);
  databaseDetails: Dataset;
  constructor(
    public loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private commonElementsService: CommonElementsService
  ) {
  }

  ngOnInit() {
    this.setRequest();
    this.requestProperties();
  }
  setRequest() {
    this.subscriptions.add(
      this.commonElementsService.commonPropertiesRequest$.subscribe((data) => {
        if (data) {
          this.commonPropertiesRequest = data;
          this.commonPropertiesRequest$.next(this.commonPropertiesRequest);
        }
      })
    );
  }
  requestProperties() {
    this.subscriptions.add(
      this.commonPropertiesRequest$.subscribe((data1) => {
        this.subscriptions.add(
          this.commonElementsService
            .requestCommonProperties(this.commonPropertiesRequest)
            .subscribe((data) => {
              if (data) {
                this.commonProperties$.next(data);
                if (this.commonPropertiesRequest.totalEntries === 0) {
                  this.commonPropertiesRequest.totalEntries = data[0].requestSize;
                }
              }
            })
        );
      })
    );
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.myPaginator = this.paginator;
      this.subscriptions.add(
        this.commonProperties$.subscribe((data) => {
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
              this.commonPropertiesRequest &&
              this.commonPropertiesRequest.limit != this.myPaginator.pageSize
            ) {
              this.commonPropertiesRequest.page = 0;
              this.paginator.pageIndex = 0;
            } else {
              this.commonPropertiesRequest.page = pageNumber;
            }
            this.commonPropertiesRequest.limit = this.myPaginator.pageSize;
            this.commonPropertiesRequest$.next(this.commonPropertiesRequest);
          });
        })
      );
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
