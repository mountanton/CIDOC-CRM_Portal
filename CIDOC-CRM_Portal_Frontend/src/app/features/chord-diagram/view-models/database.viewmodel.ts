import { ChordGroup } from "d3-chord";
import { arc } from "d3-shape";
import { IDatabase } from "../interfaces/database.interface";

export class DatabaseViewModel implements IDatabase {
  public path: string | null;

  public get href(): string {
    return `#${this.title}`; //title of database
  }

  public get tooltip(): string {
    return `${this.title} - ${this.group.value}`; //amount of database
  }

  constructor(
    private group: ChordGroup,
    radius: number,
    public title: string,
    public colour: string
  ) {
    const arcGenerator = arc();
    this.path = arcGenerator({
      startAngle: group.startAngle,
      endAngle: group.endAngle,
      innerRadius: radius - 5,
      outerRadius: radius,
    });
  }
}
