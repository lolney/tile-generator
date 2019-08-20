import { RawRivers, RawRiverSystem } from "./types";

const findRiverSystems = (rivers: RawRivers): RawRiverSystem[] => {
  return [rivers.clone()];
};

export default findRiverSystems;
