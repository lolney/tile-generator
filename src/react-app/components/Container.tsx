import Map from "./Map";
import { Options, MapLayers } from "../../common/types";
import { LatLngBounds } from "leaflet";
import { connect } from "react-redux";
import { State } from "../redux/types";
import { changeBounds, changeOptions } from "../redux/modules/settings";
import { submit } from "../redux/modules/map";
import OptionsComponent from "./Options";

const map = {
  mapStateToProps: (state: State) => ({
    layers: state.mapData.layers,
    grid: state.mapData.grid,
    loadingLayer: state.mapData.loadingLayer.name
  }),

  mapDispatchToProps: (dispatch: any) => ({
    onBoundsChange: (bounds: LatLngBounds) => dispatch(changeBounds(bounds))
  })
};

const options = {
  mapStateToProps: (state: State) => ({
    minDimensions: { width: 10, height: 10 },
    maxDimensions: { width: 120, height: 120 },
    selectedOptions: {
      format: state.settings.format,
      dimensions: state.settings.dimensions
    }
  }),
  mapDispatchToProps: (dispatch: any) => ({
    onChange: (options: Options) => dispatch(changeOptions(options)),
    onSubmit: () => dispatch(submit())
  })
};

export const OptionsContainer = connect(
  options.mapStateToProps,
  options.mapDispatchToProps
)(OptionsComponent);

export const MapContainer = connect(
  map.mapStateToProps,
  map.mapDispatchToProps
)(Map);

export class LayerCounter {
  iter: IterableIterator<string>;

  constructor() {
    const layers = Object.values(MapLayers).filter(
      layer => typeof layer === "string"
    );
    this.iter = layers[Symbol.iterator]();
  }

  next() {
    const { value } = this.iter.next();
    return value;
  }
}
