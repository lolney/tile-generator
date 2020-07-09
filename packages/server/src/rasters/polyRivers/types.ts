import { LineString, Polygon, Position } from "geojson";
import { Graph } from "graphlib";

export type RawRiver = {
  id: string;
  basinId: string;
  upstreamId: string;
  downstreamId: string;
  geom: LineString;
};

export type RawRiverPoint = Position;

export type NextPoints = { [pointId: string]: string };

export type RawRiverPoints = { [riverId: string]: RawRiverPoint };

export type GridPoints = Position[];

export type GridGraph = Graph;

export type NextNodes = { [nodeId: number]: number };
