import _ from "lodash";
import {
  MapLayers,
  LayersType,
  Elevation,
  TerrainType,
  FeatureType,
  MapLayerValue,
} from "@tile-generator/common";
import { State, TileFeature } from "../../types";

const fillOpacity = 0.75;

export const layersSelector = (state: State) => state.mapData.layers;

export const hasLayer = (layers: LayersType, layer: MapLayerValue) =>
  layers[layer] ? true : false;

export const receivedLayersSelector = (state: State) => {
  const layers = state.mapData.layers;
  const receivedLayers: Record<string, boolean> = _.fromPairs(
    (Object.values(MapLayers) as MapLayerValue[])
      .filter((key: MapLayerValue) => typeof key === "string")
      .map((key: MapLayerValue) => [key, hasLayer(layers, key)])
  );
  return receivedLayers;
};

export const selectedLayer = (state: State) => {
  const layerName = state.leaflet.selectedLayer;
  return layerName === undefined ? [] : state.mapData.layers[layerName] || [];
};

export const mapFeatureToStyle: L.StyleFunction = (
  feature: TileFeature | undefined
) => {
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
          if (feature.properties.terrain !== TerrainType.coast)
            return { fillColor: "BlanchedAlmond" };
          return {};
        case Elevation.hills:
          return { fillColor: "Burlywood", fillOpacity };
        case Elevation.mountain:
          return { fillColor: "SaddleBrown", fillOpacity };
        default:
      }
      return {};
    })();

    const terrainFeature = (() => {
      switch (feature.properties.feature) {
        case FeatureType.forest:
          return { fillColor: "ForestGreen", fillOpacity };
        case FeatureType.jungle:
          return { fillColor: "DarkGreen", fillOpacity };
        case FeatureType.marsh:
          return { fillColor: "LimeGreen", fillOpacity };
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
        return { fillColor: "DarkBlue" };
      }
    })();

    return { ...elevation, ...color, ...terrainFeature, ...rivers };
  }
};
