import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Injectable,
  OnDestroy,
  Input,
} from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { MaterialFormModule } from "../../material-form.module";
import { MaterialMinModule } from "../../material-min.module";
import { AppColors } from "src/assets/app-colors";
import { Router } from "@angular/router";
import { CoreService } from "src/app/core/services/core.service";
import { ThemeServiceService } from "src/app/core/services/themeService.service";
@Injectable()
@Component({
  standalone: true,
  imports: [MaterialFormModule, MaterialMinModule],
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleMainSidebar: EventEmitter<any> = new EventEmitter();
  @Input("tog") checked!: boolean;
  localStorage: Storage = window.localStorage;
  toggleDashBoardViewText = "Agent";
  color = AppColors.greenMain;
  status!: string;
  componentDestroyed$: Subject<boolean> = new Subject();
  headerLogoPath: string = "/assets/cidoc2.png";
  subscriptions: Subscription = new Subscription();
  nubmerOfTriples: number = 0;
  nubmerOfDatabases: number = 0;
  constructor(
    private router: Router,
    private coreService: CoreService,
    private themeService: ThemeServiceService
  ) {}

  ngOnInit() {
    this.themeService.checkIfSet();
    this.subscriptions.add(
      this.coreService.datasets$.subscribe((data) => {
        if (data != null && data.length !== 0) {
          let count = 0;
          data.forEach((dataset) => {
            count += +dataset.triples;
          });
          this.nubmerOfTriples = count;
          this.nubmerOfDatabases = data.length;
        }
      })
    );
  }

  toggleTheme() {
    this.themeService.setTheme();
  }
  toggleSideBar() {
    this.toggleMainSidebar.emit();
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }
  homePage() {
    this.router.navigate(["/datasets/chart"]);
  }
  reset() {
    localStorage.removeItem("Datasets");
    window.location.reload();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
