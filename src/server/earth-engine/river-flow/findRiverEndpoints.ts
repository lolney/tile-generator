import { RiverEndpoints, RawRiverSystem } from "./types";

const findRiverEndpoints = (river: RawRiverSystem): RiverEndpoints => {
  return river.clone();
};

export default findRiverEndpoints;
