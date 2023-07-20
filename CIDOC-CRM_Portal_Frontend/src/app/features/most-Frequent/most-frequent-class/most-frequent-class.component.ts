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
  selector: "app-most-frequent-class",
  templateUrl: "./most-frequent-class.component.html",
  styleUrls: ["./most-frequent-class.component.scss"],
})
export class MostFrequentClassComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  myPaginator!: MatPaginator;
  mostFrequentClassesRequest$: BehaviorSubject<MostFrequentRequest> = new BehaviorSubject(
    null
  );
  mostFrequentClassesRequest: MostFrequentRequest;
  mostFrequentClasses$: BehaviorSubject<MostFrequentResponse[]> = new BehaviorSubject(
    null
  );
  mostFrequentClasses: MostFrequentResponse;
  error$: Observable<string | undefined>;
  displayError$: Observable<boolean>;
  subscriptions: Subscription = new Subscription();
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["class", "triples"];
  onlyCidoc: boolean = false;
  title: string = "";
  titleOfTable = "Datasets";
  constructor(
    public loaderService: LoaderService,
    private router: Router,
    private mostFrequentService: MostFrequentService
  ) {
    if (this.router.url.includes("cidoc")) {
      this.title = "mostFrequentCIDOCCRMClasses";
      if (this.router.url.includes("instances")) {
        this.titleOfTable = "Triples";
        this.title = "mostFrequentCIDOCCRMClassesInstances";
      }
    } else {
      this.title = "mostFrequentClasses";
      if (this.router.url.includes("instances")) {
        this.titleOfTable = "Triples";
        this.title = "mostFrequentClassesInstances";
      }
    }
  }
  ngOnInit() {
    this.requestMostFrequentClasses();
  }
  requestMostFrequentClasses() {
    let propReq = {
      title: this.title,
      limit: 10,
      page: 0,
      totalEntries: 0,
    };

    this.mostFrequentService.mostFrequentPropertiesORClass(propReq).subscribe((data) => {
      if (data) {
        this.mostFrequentClasses$.next(data.mostFrequentList);
        if (propReq.totalEntries === 0) {
          propReq.totalEntries = data.totalSize;
          this.mostFrequentClassesRequest$.next(propReq);
        }
      }
    });
    this.mostFrequentClassesRequest$.next(propReq);
    this.subscriptions.add(
      this.mostFrequentClassesRequest$.subscribe((data) => {
        if (data) {
          this.mostFrequentClassesRequest = data;
        }
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.myPaginator = this.paginator;
      this.subscriptions.add(
        this.mostFrequentClasses$.subscribe((data) => {
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
              this.mostFrequentClassesRequest &&
              this.mostFrequentClassesRequest.limit != this.myPaginator.pageSize
            ) {
              this.mostFrequentClassesRequest.page = 0;
              this.paginator.pageIndex = 0;
            } else {
              this.mostFrequentClassesRequest.page = pageNumber;
            }
            this.mostFrequentClassesRequest.limit = this.myPaginator.pageSize;
            this.mostFrequentService
              .mostFrequentPropertiesORClass(this.mostFrequentClassesRequest)
              .subscribe((data) => {
                this.mostFrequentClasses$.next(data.mostFrequentList);
              });
            this.mostFrequentClassesRequest$.next(this.mostFrequentClassesRequest);
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
