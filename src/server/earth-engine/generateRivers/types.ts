import { Graph } from "graphlib";
import { RiversArray } from "./RiversArray";

export type NodeId = string;

export type VertexType = 0 | 1 | 2 | 3 | 4 | 5;
export type RiverNode = string;
export type RiverEdge = [RiverNode, RiverNode];
export type RiverIndex = [number, number];

export type RawRivers = RiversArray<boolean>;
export type RawRiverSystem = RiversArray<boolean>;
export type RiverEndpoints = RiversArray<boolean>;
export type RiverNodes = Graph;
export type RiverNodesWithSource = {
  graph: Graph;
  source: NodeId;
};
