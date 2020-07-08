import { createRawHexPositions } from "../createRawHexPositions";

const fixtures = [
  {
    width: 7,
    height: 5,
    lon_start: 0,
    lon_end: 50,
    lat_start: 0,
    lat_end: -50,
  },
  {
    width: 10,
    height: 10,
    lon_start: -71.0863494873047,
    lon_end: -71.03004455566408,
    lat_start: 42.38086519582323,
    lat_end: 42.3245602642,
  },
];

describe("createRawHexPositions", () => {
  it.each(fixtures)("should generate a list of positions", (fixture) => {
    const positions = createRawHexPositions(fixture);
    for (const position of positions) {
      expect(position).toHaveLength(2);
    }
  });

  it.each(fixtures)(
    "should generate the right number of positions",
    (fixture) => {
      const expectedLength = 2 * fixture.width + 1;
      const expectedHeight = fixture.height + 1;

      const positions = createRawHexPositions(fixture);
      expect(positions).toHaveLength(expectedLength * expectedHeight);
    }
  );
});
