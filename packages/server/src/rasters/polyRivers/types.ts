import { LineString, Position } from "geojson";

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

export type NextNodes = { [nodeId: number]: number };

export type Endpoints = string[];

export type RiverDirection = "north" | "south" | "east" | "west";
