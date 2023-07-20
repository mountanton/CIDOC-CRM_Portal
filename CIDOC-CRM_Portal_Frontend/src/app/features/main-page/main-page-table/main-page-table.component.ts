import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MaterialMinModule } from "src/app/shared/material-min.module";
import { MaterialFormModule } from "src/app/shared/material-form.module";
import { LoaderService } from "src/app/loader/loader.service";
import { CoreService } from "src/app/core/services/core.service";
import { Dataset } from "src/app/core/models/dataset.model";

@Component({
  standalone: true,
  imports: [MaterialMinModule, MaterialFormModule],
  selector: "app-main-page-table",
  templateUrl: "./main-page-table.component.html",
  styleUrls: ["./main-page-table.component.scss"],
})
export class MainPageTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // myPaginator!: MatPaginator;
  subscriptions: Subscription = new Subscription();
  columnsToDisplay = [
    "title",
    "endpoint",
    "triples",
    "entities",
    "properties",
    "classes",
    "cidocProperties",
    "cidocClasses",
    "triplesWithCIDOCproperty",
    "triplesWithCIDOCpropertyPercentage",
    "triplesWithCIDOCinstance",
    "triplesWithCIDOCinstancePercentage",
  ];
  dataSource!: MatTableDataSource<Dataset>;
  constructor(
    private coreService: CoreService,
    public loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.coreService.datasets$.subscribe((data) => {
        if (data != null && data.length !== 0) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      })
    );
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  seeDatabase(databaseTitle: number) {
    this.router.navigate([`dataset-details/${databaseTitle}/properties`]);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
