import { Chord, ribbon } from "d3-chord";
import { DatabaseViewModel } from "./database.viewmodel";

export class ChordViewModel {
  private innerRadius: number;
  public path: string | null;

  public get tooltip(): string {
    const sourceToTarget = `${this.chord.source.value} ${this.targetDatabase.title} → ${this.sourceDatabase.title}`;
    const targetToSource = `\n${this.chord.target.value} ${this.sourceDatabase.title} → ${this.targetDatabase.title}`;
    return this.sourceDatabase.title === this.targetDatabase.title
      ? sourceToTarget
      : sourceToTarget + targetToSource;
  }

  constructor(
    private chord: Chord,
    radius: number,
    public sourceDatabase: DatabaseViewModel,
    public targetDatabase: DatabaseViewModel
  ) {
    this.innerRadius = radius - 10;
    var ribbonGen = ribbon();
    this.path = <string | null>(<unknown>ribbonGen({
      source: {
        startAngle: chord.source.startAngle,
        endAngle: chord.source.endAngle,
        radius: this.innerRadius,
      },
      target: {
        startAngle: chord.target.startAngle,
        endAngle: chord.target.endAngle,
        radius: this.innerRadius,
      },
    }));
  }
}
