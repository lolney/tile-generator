import _ from "lodash";
import {
  MapLayers,
  LayersType,
  Elevation,
  TerrainType,
  FeatureType
} from "../../../../common/types";
import { State } from "../../types";

export const layersSelector = (state: State) => state.mapData.layers;

export const hasLayer = (layers: LayersType, layer: string) =>
  layers[layer] ? true : false;

export const receivedLayersSelector = (state: State) => {
  const layers = state.mapData.layers;
  const receivedLayers: Record<string, boolean> = _.fromPairs(
    Object.values(MapLayers)
      .filter(key => typeof key == "string")
      .map((key: string) => [key, hasLayer(layers, key)])
  );
  return receivedLayers;
};

export const selectedLayer = (state: State) => {
  const layerName = state.leaflet.selectedLayer;
  return layerName == undefined ? [] : state.mapData.layers[layerName];
};

export const mapFeatureToStyle: L.StyleFunction = feature => {
  if (feature === undefined || feature.properties === undefined) {
    return {};
  } else {
    const color = (() => {
      switch (feature.properties.terrain) {
        case TerrainType.coast:
          return { color: "cyan" };
        case TerrainType.ocean:
          return { color: "blue" };
        case TerrainType.grass:
          return { color: "green" };
        case TerrainType.plains:
          return { color: "gold" };
        case TerrainType.desert:
          return { color: "sandybrown" };
        case TerrainType.tundra:
          return { color: "grey" };
        case TerrainType.ice:
          return { color: "white" };
        default:
          return {};
      }
    })();

    const elevation = (() => {
      switch (feature.properties.elevation) {
        case Elevation.flat:
          if (feature.properties.terrain != TerrainType.coast)
            return { fillColor: "green" };
        case Elevation.hills:
          return { fillColor: "brown" };
        case Elevation.mountain:
          return { fillColor: "black" };
        default:
      }
      return {};
    })();

    const terrainFeature = (() => {
      switch (feature.properties.feature) {
        case FeatureType.forest:
          return { fillColor: "DarkOliveGreen" };
        case FeatureType.jungle:
          return { fillColor: "black" };
        case FeatureType.marsh:
          return { fillColor: "lime" };
        default:
          return {};
      }
    })();

    const rivers = (() => {
      if (
        !feature.properties.river ||
        _.isEqual(feature.properties.river, {})
      ) {
        return {};
      } else {
        return { fillColor: "blue" };
      }
    })();

    return { ...elevation, ...color, ...terrainFeature, ...rivers };
  }
};
