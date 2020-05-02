import { Koppen, FeatureType, TerrainType } from "@tile-generator/common";

export function getForestType(koppen: Koppen): FeatureType {
  switch (koppen) {
    case Koppen.Af:
    case Koppen.Am:
    case Koppen.Aw: // mix forest
      return FeatureType.jungle;
    default:
      return FeatureType.forest;
  }
}

export function getTerrainType(koppen: Koppen): TerrainType {
  switch (koppen) {
    case Koppen.Dfc: // might sometimes want grass/plains
    case Koppen.Dfd:
    case Koppen.Dsc: // might sometimes want grass/plains
    case Koppen.Dsd:
    case Koppen.Dwc: // might sometimes want grass/plains
    case Koppen.Dwd:
    case Koppen.ET: // might sometimes want ice
      return TerrainType.tundra;
    case Koppen.Dsa:
    case Koppen.Dsb:
    case Koppen.BSh:
    case Koppen.BSk:
    case Koppen.Csa:
    case Koppen.Csc:
      return TerrainType.plains;
    case Koppen.BWh:
    case Koppen.BWk: // might sometimes want plains
      return TerrainType.desert;
    case Koppen.Af:
    case Koppen.Am:
    case Koppen.Aw:
    case Koppen.Dfa:
    case Koppen.Dfb:
    case Koppen.Dwa:
    case Koppen.Dwb:
    case Koppen.Csb: // warm summer med; mixed with plains
    case Koppen.Cfa:
    case Koppen.Cfb:
    case Koppen.Cfc:
    case Koppen.Cwa:
    case Koppen.Cwb:
    case Koppen.Cwc:
      return TerrainType.grass;
    case Koppen.EF:
      return TerrainType.ice;
    case Koppen.Ocean:
      return TerrainType.coast;
    default:
      return TerrainType.ocean;
  }
}
