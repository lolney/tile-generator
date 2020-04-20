import { Graph } from "graphlib";
import { TilesArray } from "../../../common/TilesArray";

export type NodeId = string;

export type VertexType = 0 | 1 | 2 | 3 | 4 | 5;
export type RiverNode = string;
export type RiverEdge = [RiverNode, RiverNode];
export type RiverIndex = [number, number];

export type RawRivers = TilesArray<boolean>;
export type RawRiverSystem = TilesArray<boolean>;
export type RiverEndpoints = TilesArray<boolean>;
export type RiverNodes = Graph;
export type RiverNodesWithSource = {
  graph: Graph;
  source: NodeId;
};
