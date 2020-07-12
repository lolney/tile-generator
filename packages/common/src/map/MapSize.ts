import { Dimensions, SizeString } from "../types";

export abstract class MapSize {
  static mapSizes: Record<SizeString, Dimensions>;

  static dimensionsToMapSize({ height, width }: Dimensions): SizeString {
    const size = height * width;
    for (const [name, dimensions] of Object.entries(this.mapSizes) as [
      SizeString,
      Dimensions
    ][]) {
      if (size <= dimensions.height * dimensions.width) return name;
    }
    return "MAPSIZE_HUGE";
  }
}

export class Civ6MapSize extends MapSize {
  static mapSizes: Record<SizeString, Dimensions> = {
    MAPSIZE_DUEL: { width: 44, height: 26 },
    MAPSIZE_TINY: { width: 60, height: 38 },
    MAPSIZE_SMALL: { width: 74, height: 46 },
    MAPSIZE_STANDARD: { width: 84, height: 54 },
    MAPSIZE_LARGE: { width: 96, height: 60 },
    MAPSIZE_HUGE: { width: 106, height: 66 },
  };
}

export class Civ5MapSize extends MapSize {
  static mapSizes: Record<SizeString, Dimensions> = {
    MAPSIZE_DUEL: { width: 40, height: 24 },
    MAPSIZE_TINY: { width: 56, height: 36 },
    MAPSIZE_SMALL: { width: 66, height: 42 },
    MAPSIZE_STANDARD: { width: 80, height: 52 },
    MAPSIZE_LARGE: { width: 104, height: 64 },
    MAPSIZE_HUGE: { width: 120, height: 80 },
  };
}
