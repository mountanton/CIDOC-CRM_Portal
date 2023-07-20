import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MaterialFormModule } from "../../material-form.module";
import { MaterialMinModule } from "../../material-min.module";
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Subscription } from "rxjs";
import { CoreService } from "src/app/core/services/core.service";

@Component({
  standalone: true,
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
  providers: [],
  imports: [
    MaterialFormModule,
    MaterialMinModule,
    HeaderComponent,
    RouterModule,
    SidebarComponent,
  ],
})
export class DefaultComponent implements OnInit {
  sideBarOpen = true;
  subscriptions: Subscription = new Subscription();
  constructor(private coreService: CoreService, private router: Router) {}

  ngOnInit() {
    if (this.router.url === "/") this.router.navigateByUrl("/datasets/chart");
    this.subscriptions.add(
      this.coreService.datasets$.subscribe((data) => {
        if (data == null || data.length === 0) {
          this.coreService.requestDatasets().subscribe((datasets) => {
            if (datasets) {
              this.coreService.setDatasets(datasets);
            }
          });
        }
      })
    );
    this.subscriptions.add(
      this.coreService.autocompleteClassProperties$.subscribe((data) => {
        if (data == null) {
          this.coreService
            .requestAutocompleteClassProperty()
            .subscribe((autocomplete) => {
              if (autocomplete) {
                this.coreService.setAutocompleteClassProperty(autocomplete);
              }
            });
        }
      })
    );
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
