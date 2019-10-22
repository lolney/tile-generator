import findRiverSystems from "../findRiverSystems";
import { RiversArray } from "../RiversArray";

describe("findRiverSystems", () => {
  const oneRiver = [
    [true, true, false, false],
    [true, true, false, false],
    [true, true, false, false],
    [true, true, false, false]
  ];

  const threeRivers = [
    [true, true, false, true],
    [true, true, false, false],
    [false, false, true, true],
    [false, false, true, true]
  ];

  it("should find rivers correctly when one is present", () => {
    const rivers = findRiverSystems(RiversArray.from2D(oneRiver));
    expect(rivers.length).toEqual(1);
  });

  it("should find rivers correctly when multiple are present", () => {
    const rivers = findRiverSystems(RiversArray.from2D(threeRivers));
    expect(rivers.length).toEqual(3);
  });
});
