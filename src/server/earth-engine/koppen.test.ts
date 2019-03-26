import { getClimateType } from "./koppen";
import { Koppen } from "../../common/types";

describe("koppen", () => {
  it("getClimateType on land", async () => {
    const type = await getClimateType(10, 10);
    expect(type).toEqual(Koppen.Aw);
  });

  it("getClimateType in Ocean", async () => {
    const type = await getClimateType(0, 0);
    expect(type).toEqual(Koppen.Ocean);
  });

  it("getClimateType for invalid coords", async () => {
    const type = await getClimateType(100, 100);
    expect(type).toEqual(undefined);
  });
});
