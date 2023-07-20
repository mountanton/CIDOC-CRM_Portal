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
import { CommonElementsRequest, CommonRDFClasses } from "../models/common-elements.model";
import { CommonElementsService } from "../service/common-elements.service";

@Component({
  standalone: true,
  imports: [MaterialMinModule, MaterialFormModule],
  selector: "app-common-elements-classes",
  templateUrl: "./common-elements-classes.component.html",
  styleUrls: ["./common-elements-classes.component.scss"],
})
export class CommonElementsClassesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  myPaginator!: MatPaginator;
  commonRDFClassesRequest$: BehaviorSubject<CommonElementsRequest> = new BehaviorSubject(
    null
  );
  commonRDFClassesRequest: CommonElementsRequest;
  commonRDFClasses$: BehaviorSubject<CommonRDFClasses[]> = new BehaviorSubject(null);
  commonRDFClasses: CommonRDFClasses;
  error$: Observable<string | undefined>;
  displayError$: Observable<boolean>;
  subscriptions: Subscription = new Subscription();
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ["rdfClass"];
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
    this.requestRDFClasses();
  }
  setRequest() {
    this.subscriptions.add(
      this.commonElementsService.commonRDFClassesRequest$.subscribe((data) => {
        if (data) {
          this.commonRDFClassesRequest = data;
          this.commonRDFClassesRequest$.next(this.commonRDFClassesRequest);
        }
      })
    );
  }
  requestRDFClasses() {
    this.subscriptions.add(
      this.commonRDFClassesRequest$.subscribe((data1) => {
        this.subscriptions.add(
          this.commonElementsService
            .requestCommonRDFClasses(this.commonRDFClassesRequest)
            .subscribe((data) => {
              if (data) {
                this.commonRDFClasses$.next(data);
                if (this.commonRDFClassesRequest.totalEntries === 0) {
                  this.commonRDFClassesRequest.totalEntries = data[0].requestSize;
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
        this.commonRDFClasses$.subscribe((data) => {
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
              this.commonRDFClassesRequest &&
              this.commonRDFClassesRequest.limit != this.myPaginator.pageSize
            ) {
              this.commonRDFClassesRequest.page = 0;
              this.paginator.pageIndex = 0;
            } else {
              this.commonRDFClassesRequest.page = pageNumber;
            }
            this.commonRDFClassesRequest.limit = this.myPaginator.pageSize;
            this.commonRDFClassesRequest$.next(this.commonRDFClassesRequest);
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
