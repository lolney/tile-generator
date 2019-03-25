import { getClimateType } from "./koppen";
import { Koppen } from "../../common/types";

describe("koppen", () => {
  it("getClimateType", async () => {
    const type = await getClimateType(10, 10);
    expect(type).toEqual(Koppen.Aw);
  });

  it("getClimateType", async () => {
    const type = await getClimateType(0, 0);
    expect(type).toEqual(Koppen.Ocean);
  });
});
