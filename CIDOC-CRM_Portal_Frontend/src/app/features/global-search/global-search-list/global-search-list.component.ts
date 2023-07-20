import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { MaterialMinModule } from "src/app/shared/material-min.module";
import { LoaderService } from "src/app/loader/loader.service";
import { CoreService } from "src/app/core/services/core.service";
import { Dataset } from "src/app/core/models/dataset.model";
import { GlobalSearchRequest, GlobalSearchResponse } from "../model/global-search.model";
import { GlobalSearchService } from "../service/global-search.service";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  imports: [MaterialMinModule, MaterialFormModule],
  selector: "app-global-search-list",
  templateUrl: "./global-search-list.component.html",
  styleUrls: ["./global-search-list.component.scss"],
})
export class GlobalSearchListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  myPaginator!: MatPaginator;
  globalSearchRequest$: BehaviorSubject<GlobalSearchRequest> = new BehaviorSubject(null);
  globalSearchRequest: GlobalSearchRequest;
  globalSearchResponse$: BehaviorSubject<GlobalSearchResponse[]> = new BehaviorSubject(
    null
  );
  globalSearchResponse: GlobalSearchResponse;
  error$: Observable<string | undefined>;
  displayError$: Observable<boolean>;
  subscriptions: Subscription = new Subscription();
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["title", "url", "triples"];
  databaseDetails$: BehaviorSubject<Dataset> = new BehaviorSubject(null);
  databaseDetails: Dataset;
  datasets: Dataset[];
  constructor(
    private router: Router,
    private coreService: CoreService,
    public loaderService: LoaderService,
    private globalSearchService: GlobalSearchService
  ) {}

  ngOnInit() {
    this.setRequest();
    this.allDatasets();
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
          this.globalSearchRequest$.next(this.globalSearchRequest);
        }
      })
    );
  }
  requestGlobalSearch() {
    this.subscriptions.add(
      this.globalSearchRequest$.subscribe(() => {
        this.subscriptions.add(
          this.globalSearchService
            .globalSearchRequest(this.globalSearchRequest)
            .subscribe((data) => {
              if (data) {
                this.globalSearchResponse$.next(data);
                if (this.globalSearchRequest.totalEntries === 0 && data.length !== 0) {
                  this.globalSearchRequest.totalEntries = data[0].requestSize;
                }
              }
            })
        );
      })
    );
  }
  showTitleOfDataset(url: string) {
    for (let i = 0; i < this.datasets.length; i++) {
      if (this.datasets[i].endpoint === url) {
        return this.datasets[i].title;
      }
    }
    return url;
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
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.myPaginator = this.paginator;
      this.subscriptions.add(
        this.globalSearchResponse$.subscribe((data) => {
          if (data != null) {
            let dataWithTitle = this.transformDataWithTitle(data);
            this.dataSource = new MatTableDataSource(dataWithTitle);
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
              this.globalSearchRequest &&
              this.globalSearchRequest.limit != this.myPaginator.pageSize
            ) {
              this.globalSearchRequest.page = 0;
              this.paginator.pageIndex = 0;
            } else {
              this.globalSearchRequest.page = pageNumber;
            }
            this.globalSearchRequest.limit = this.myPaginator.pageSize;
            this.globalSearchRequest$.next(this.globalSearchRequest);
          });
        })
      );
    });
  }
  navigateToDataset(globalDataset: GlobalSearchResponse) {
    let dataset = this.datasets.find((data) => data.endpoint === globalDataset.dataset);
    this.router.navigate([`dataset-details/${dataset.id}/properties`]);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
