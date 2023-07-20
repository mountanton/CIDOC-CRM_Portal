import { Component, Input, OnInit } from "@angular/core";
import { MaterialMinModule } from "../../material-min.module";
import { AppColors } from "src/assets/app-colors";

@Component({
  standalone: true,
  imports: [MaterialMinModule],
  selector: "app-info-card",
  templateUrl: "./info-card.component.html",
  styleUrls: ["./info-card.component.scss"],
})
export class InfoCardComponent implements OnInit {
  @Input() toolbar: boolean = true;
  @Input() title: string;
  @Input() icon: string;
  @Input() buttonText: string;
  @Input() link: string;
  @Input() hasButton: boolean;
  @Input() bgColor: string = AppColors.seaGreen;
  @Input() color: string = AppColors.primary;

  @Input() symbol: string ;
  constructor() {}

  ngOnInit() {}
}
