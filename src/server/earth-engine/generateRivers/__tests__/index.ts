import generateRivers from "../index";

describe("generateRivers", () => {
  it("returns an array of tiles", () => {
    const bounds = {
      _southWest: { lat: 1, lng: 2 },
      _northEast: { lat: 3, lng: 4 }
    };
    const rivers = generateRivers(bounds);

    expect(rivers).toBeDefined();
  });
});
