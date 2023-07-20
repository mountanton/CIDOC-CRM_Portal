import { Component, Input, OnInit } from "@angular/core";
import { SidebarService } from "./sidebar.service";
import { AppColors } from "src/assets/app-colors";
import { MaterialMinModule } from "../../material-min.module";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  imports: [MaterialMinModule, RouterModule],
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  menu = this.sidebarService.menu;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {}
}
