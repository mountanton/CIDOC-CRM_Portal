import { Component, Input, OnInit } from "@angular/core";
import { DatabaseViewModel } from "../../view-models/database.viewmodel";
import { MaterialMinModule } from "src/app/shared/material-min.module";

@Component({
  standalone: true,
  imports: [MaterialMinModule],
  selector: "[app-databases]",
  templateUrl: "./databases.component.html",
  styleUrls: ["./databases.component.scss"],
})
export class DatabasesComponent {
  @Input() public databaseVms: Array<DatabaseViewModel> = [];

  constructor() {}
}
