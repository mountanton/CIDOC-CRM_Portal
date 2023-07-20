import { descending } from "d3-array";
import { chord } from "d3-chord";
import { IDatabase } from "../interfaces/database.interface";
import { DatabaseViewModel } from "./database.viewmodel";
import { ChordViewModel } from "./chord-viewmodel";

export class ChordDiagramViewModel {
  public databaseVms: Array<DatabaseViewModel> = [];
  public chordVms: Array<ChordViewModel> = [];

  public constructor(inputMatrix: number[][], radius: number, groupDetails: IDatabase[]) {
    const chordLayout = chord()
      .padAngle(10 / (radius - 10))
      .sortSubgroups(descending)
      .sortChords(descending);

    const chords = chordLayout(inputMatrix);

    if (chords) {
      chords.groups.forEach((group, index) => {
        this.databaseVms.push(
          new DatabaseViewModel(
            group,
            radius,
            groupDetails[index].title,
            groupDetails[index].colour
          )
        );
      });
      this.chordVms = chords.map(
        (chord) =>
          new ChordViewModel(
            chord,
            radius,
            this.databaseVms[chord.source.index],
            this.databaseVms[chord.target.index]
          )
      );
    }
  }
}
