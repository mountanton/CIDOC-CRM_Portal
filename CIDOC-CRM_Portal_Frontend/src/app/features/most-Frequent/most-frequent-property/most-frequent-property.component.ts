import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { MaterialMinModule } from "src/app/shared/material-min.module";
import { MostFrequentRequest, MostFrequentResponse } from "../models/most-frequent.model";
import { LoaderService } from "src/app/loader/loader.service";
import { Router } from "@angular/router";
import { MostFrequentService } from "../services/most-frequent.service";

@Component({
  standalone: true,
  imports: [MaterialMinModule, MaterialFormModule],
  selector: "app-most-frequent-property",
  templateUrl: "./most-frequent-property.component.html",
  styleUrls: ["./most-frequent-property.component.scss"],
})
export class MostFrequentPropertyComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  myPaginator!: MatPaginator;
  mostFrequentPropertiesRequest$: BehaviorSubject<MostFrequentRequest> =
    new BehaviorSubject(null);
  mostFrequentPropertiesRequest: MostFrequentRequest;
  mostFrequentProperties$: BehaviorSubject<MostFrequentResponse[]> = new BehaviorSubject(
    null
  );
  mostFrequentProperties: MostFrequentResponse;
  error$: Observable<string | undefined>;
  displayError$: Observable<boolean>;
  subscriptions: Subscription = new Subscription();
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["property", "triples"];
  onlyCidoc: boolean = false;
  title: string = "";
  titleOfTable = "Datasets";
  constructor(
    public loaderService: LoaderService,
    private router: Router,
    private mostFrequentService: MostFrequentService
  ) {
    if (this.router.url.includes("cidoc")) {
      this.title = "mostFrequentCIDOCCRMProperties";
      if (this.router.url.includes("instances")) {
        this.titleOfTable = "Triples";
        this.title = "mostFrequentCIDOCCRMPropertiesInstances";
      }
    } else {
      this.title = "mostFrequentProperties";
      if (this.router.url.includes("instances")) {
        this.titleOfTable = "Triples";
        this.title = "mostFrequentPropertiesInstances";
      }
    }
  }
  ngOnInit() {
    this.requestMostFrequentProperties();
  }
  requestMostFrequentProperties() {
    let propReq = {
      title: this.title,
      limit: 10,
      page: 0,
      totalEntries: 0,
    };

    this.mostFrequentService.mostFrequentPropertiesORClass(propReq).subscribe((data) => {
      if (data) {
        this.mostFrequentProperties$.next(data.mostFrequentList);
        if (propReq.totalEntries === 0) {
          propReq.totalEntries = data.totalSize;
          this.mostFrequentPropertiesRequest$.next(propReq);
        }
      }
    });
    this.mostFrequentPropertiesRequest$.next(propReq);
    this.subscriptions.add(
      this.mostFrequentPropertiesRequest$.subscribe((data) => {
        if (data) {
          this.mostFrequentPropertiesRequest = data;
        }
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.myPaginator = this.paginator;
      this.subscriptions.add(
        this.mostFrequentProperties$.subscribe((data) => {
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
              this.mostFrequentPropertiesRequest &&
              this.mostFrequentPropertiesRequest.limit != this.myPaginator.pageSize
            ) {
              this.mostFrequentPropertiesRequest.page = 0;
              this.paginator.pageIndex = 0;
            } else {
              this.mostFrequentPropertiesRequest.page = pageNumber;
            }
            this.mostFrequentPropertiesRequest.limit = this.myPaginator.pageSize;
            this.mostFrequentService
              .mostFrequentPropertiesORClass(this.mostFrequentPropertiesRequest)
              .subscribe((data) => {
                this.mostFrequentProperties$.next(data.mostFrequentList);
              });
            this.mostFrequentPropertiesRequest$.next(this.mostFrequentPropertiesRequest);
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
