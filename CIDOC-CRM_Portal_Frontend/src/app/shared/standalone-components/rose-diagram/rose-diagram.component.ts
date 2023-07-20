import { Component, Input, OnInit } from "@angular/core";
import { NgxEchartsModule, ThemeOption } from "ngx-echarts";
import { Observable, Subscription } from "rxjs";
import { BarChartModel } from "src/app/core/models/charts.model";
import type { EChartsOption } from "echarts";
import { ThemeServiceService } from "src/app/core/services/themeService.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  imports: [NgxEchartsModule, MatButtonModule, MatIconModule, CommonModule],
  selector: "app-rose-diagram",
  templateUrl: "./rose-diagram.component.html",
  styleUrls: ["./rose-diagram.component.scss"],
})
export class RoseDiagramComponent implements OnInit {
  @Input() data$: Observable<BarChartModel[]>;
  @Input() title: string = "Data";

  subscriptions: Subscription = new Subscription();
  data;
  theme: string | ThemeOption = undefined;
  options: EChartsOption;
  //
  showArrowMechanism: boolean = false;
  dataSize: number = 0;
  printStart: number = 0;
  printEnd: number = 10;
  constructor(public themeService: ThemeServiceService) {}
  ngOnInit(): void {
    if (this.data$ !== undefined) {
      this.subscriptions.add(
        this.data$.subscribe((data) => {
          this.data = data;
          if (data && data.length !== 0) {
            this.dataSize = data.length;
            this.printStart = 0;
            this.printEnd = 10;
            this.data = this.sortArray(this.data);
            this.createPrintSize(this.data);
          }else{
            this.createChart([]);
          }
        })
      );
    } else {
      this.createChart([]);
    }
    // this.test();
  }
  createChart(myData: BarChartModel[]) {
    let dataNames = [];
    let data = [];
    for (let i = 0; i < myData.length; i++) {
      dataNames.push(myData[i].name);
      let tmpData = { value: myData[i].value, name: myData[i].name };
      data.push(tmpData);
    }

    this.options = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        align: "auto",
        bottom: 10,
        data: dataNames,
        textStyle: {
          color: "black",
        },
      },
      calculable: true,
      series: [
        {
          name: "Chart",
          type: "pie",
          radius: [30, 110],
          roseType: "area",
          data: data,
          label: {
            color: "black",
          },
        },
      ],
    };
    this.themeService.themeColor$.subscribe((data) => {
      if (data === "theme-dark") {
        this.options.series[0].label.color = "white";
        this.options.legend = { ...this.options.legend, textStyle: { color: "" } };
        this.options.legend.textStyle.color = "white";
      } else {
        this.options.series[0].label.color = "black";
        this.options.legend = { ...this.options.legend, textStyle: { color: "" } };
        this.options.legend.textStyle.color = "black";
      }
      this.options = { ...this.options };
    });
  }
  createPrintSize(myData: BarChartModel[]) {
    if (this.data.length < 10) {
      this.showArrowMechanism = false;
      this.createChart(myData);
    } else {
      this.showArrowMechanism = true;
      let newData = [];
      for (let i = this.printStart; i < this.printEnd; i++) {
        newData.push(myData[i]);
      }

      this.createChart(newData);
    }
  }
  nextArrow() {
    if (this.dataSize - this.printEnd > 10) {
      this.printEnd += 10;
      this.printStart += 10;
    } else {
      this.printEnd = this.dataSize;
      this.printStart = this.printEnd - 10;
    }
    this.createPrintSize(this.data);
  }
  prevArrow() {
    if (this.printEnd === this.dataSize) {
      this.printEnd -= this.printEnd % 10;
      this.printStart -= this.printStart % 10;
      this.createPrintSize(this.data);
      return;
    }
    if (this.printStart - 10 > 0) {
      this.printStart -= 10;
    } else {
      this.printStart = 0;
    }
    this.printEnd = this.printStart + 10;
    this.createPrintSize(this.data);
    return;
  }

  sortArray(arr: BarChartModel[]): BarChartModel[] {
    return arr.sort((a, b) => b.value - a.value);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
