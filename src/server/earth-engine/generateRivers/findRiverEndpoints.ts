import { RiverEndpoints, RawRiverSystem } from "./types";

// not a priority
const findRiverEndpoints = (river: RawRiverSystem): RiverEndpoints => {
  return river.clone();
};

export default findRiverEndpoints;
