import { FeatureCollection, Point } from "geojson";
import { nearestPoint } from "@turf/turf";
import { RawRiverPoints, NextPoints, GridPoints, NextNodes } from "./types";

export class Condenser {
  gridPoints: FeatureCollection<Point>;

  constructor(
    public riverPoints: RawRiverPoints,
    public nextPoints: NextPoints,
    gridPoints: GridPoints
  ) {
    this.gridPoints = {
      type: "FeatureCollection",
      features: gridPoints.map((point, i) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: point,
        },
        properties: {},
      })),
    };
  }

  static condense = (
    riverPoints: RawRiverPoints,
    nextPoints: NextPoints,
    gridPoints: GridPoints,
    endpointIds: string[]
  ) => new Condenser(riverPoints, nextPoints, gridPoints).condense(endpointIds);

  getNextPoint = (pointId: string) => this.nextPoints[pointId];

  getNearestNode = (pointId: string) => {
    const reference = this.riverPoints[pointId];
    return nearestPoint(reference, this.gridPoints).properties.featureIndex;
  };

  condense = (endpointIds: string[]) => {
    const nextNodes: NextNodes = {};

    for (const endpoint of endpointIds) {
      let point = endpoint;
      let node = this.getNearestNode(point);

      while (true) {
        let nextPoint = this.getNextPoint(point);
        if (!nextPoint) break;
        let nextNode = this.getNearestNode(nextPoint);

        point = nextPoint;

        if (nextNode == node) continue;

        nextNodes[node] = nextNode;
        node = nextNode;
      }
    }

    return nextNodes;
  };
}
