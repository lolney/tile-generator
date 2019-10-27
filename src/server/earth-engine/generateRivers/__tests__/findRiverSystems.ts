import findRiverSystems from "../findRiverSystems";
import { RiversArray } from "../RiversArray";

describe("findRiverSystems", () => {
  const oneRiver = [
    [true, true, false, false],
    [true, true, false, false],
    [true, true, false, false],
    [true, true, false, false]
  ];

  const allTrue = Array(16).fill(true);

  const twoRivers = [
    [true, true, false, true],
    [true, true, false, false],
    [false, false, true, true],
    [false, false, true, true]
  ];

  const threeRivers = [
    [true, true, false, true],
    [true, false, false, false],
    [false, false, true, true],
    [false, false, true, true]
  ];

  it("should find rivers correctly when one is present", () => {
    const rivers = findRiverSystems(RiversArray.from2D(oneRiver));
    expect(rivers.length).toEqual(1);
  });

  it("should return a rivers array with all true if the input is all true", () => {
    const [river] = findRiverSystems(new RiversArray(allTrue, 4));
    expect(river.fields).toEqual(allTrue);
  });

  it("should find rivers correctly when multiple are present", () => {
    const rivers = findRiverSystems(RiversArray.from2D(twoRivers));
    expect(rivers.length).toEqual(2);
  });

  it("should find rivers correctly when multiple are present", () => {
    const rivers = findRiverSystems(RiversArray.from2D(threeRivers));
    expect(rivers.length).toEqual(3);
  });
});
