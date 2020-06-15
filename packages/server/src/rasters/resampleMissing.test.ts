import { range } from "lodash";
import { Polygon } from "@turf/turf";
import { resampleMissing } from "./resampleMissing";
import eureka from "../fixtures/eureka.json";

describe("resampleMissing", () => {
  const numbers: number[] = Array(10).fill(undefined);
  numbers[0] = 100;
  numbers[4] = 22;
  numbers[7] = 101;

  const sample = async (tiles: Polygon[]) => range(0, 10);
  const expected = [100, 0, 1, 2, 22, 3, 4, 101, 5, 6];

  it("should fill the missing elements with results from sample", async () => {
    const result = await resampleMissing(
      eureka.slice(0, 10) as Polygon[],
      numbers,
      sample
    );
    expect(numbers).toHaveLength(result.length);
    expect(result).toEqual(expected);
  });
});
