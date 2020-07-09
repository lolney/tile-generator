import { range } from "lodash";
import { Condenser } from "../condenseRiverPoints";

const grid = range(10).map((i) => [0, i]);

const riverPoints = {
  "a,1": [0, -10],
  "a,2": [0, -5],
  "a,3": [0, 0],
  "b,0": [0, 0.1],
  "b,1": [0, 0.4],
  "b,2": [0, 0.6],
  "b,3": [0, 7],
  "b,4": [0, 14],
};

const nextPoints = {
  "a,1": "a,2",
  "a,2": "a,3",
  "a,3": "b,0",
  "b,0": "b,1",
  "b,1": "b,2",
  "b,2": "b,3",
  "b,3": "b,4",
};

describe("condense river points", () => {
  it("finds the appropriate sequence of points", () => {
    const condenser = new Condenser(riverPoints, nextPoints, grid);
    const result = condenser.condense(["a,1"]);

    expect(result).toEqual({
      0: 1,
      1: 7,
      7: 9,
    });
  });
});
