import { RawRivers, RawRiverSystem } from "./types";
import { RiversArray } from "./RiversArray";

const markRiverSystem = (
  rivers: RawRivers,
  explored: RiversArray<Boolean>,
  i: number,
  j: number
): RawRiverSystem => {
  let stack: Array<[number, number]> = [[i, j]];
  const system = rivers.cloneWith(false);

  while (true) {
    const pair = stack.pop();
    if (!pair) break; // typescript can't infer this is not undefined otherwise
    const [i, j] = pair;

    if (rivers.get(i, j) && !system.get(i, j)) {
      explored.set(i, j, true);
      system.set(i, j, true);
      stack = stack.concat(Array.from(rivers.neighbors(i, j)));
    }
  }

  return system;
};

// find contiguous areas
const findRiverSystems = (rivers: RawRivers): RawRiverSystem[] => {
  const explored = rivers.cloneWith(false);
  const riverSystems: RawRiverSystem[] = [];

  for (const [i, j] of rivers.pairs()) {
    if (rivers.get(i, j) && !explored.get(i, j)) {
      const system = markRiverSystem(rivers, explored, i, j);
      riverSystems.push(system);
    }
  }

  return riverSystems;
};

export default findRiverSystems;
