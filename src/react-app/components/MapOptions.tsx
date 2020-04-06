import React from "react";
import { connect, MapStateToProps, MapDispatchToProps } from "react-redux";
import { State } from "../redux/types";
import { receivedLayersSelector } from "../redux/modules/leaflet/selectors";
import { selectLayer } from "../redux/modules/leaflet";
import { MapLayerValue } from "../../common/types";

type MapOptionsProps = DispatchProps & StateProps;

type StateProps = {
  selectedLayer: MapLayerValue | undefined;
  receivedLayers: Record<MapLayerValue, boolean>;
  loadingLayer?: string;
};

type DispatchProps = {
  onLayerSelect: (option: MapLayerValue) => void;
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = state => ({
  selectedLayer: state.leaflet.selectedLayer,
  receivedLayers: receivedLayersSelector(state),
  loadingLayer: state.mapData.loadingLayer.name
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = {
  onLayerSelect: selectLayer
};

const MapOptions: React.SFC<MapOptionsProps> = (props: MapOptionsProps) => (
  <div className="layers-container">
    {(Object.entries(props.receivedLayers) as [MapLayerValue, boolean][]).map(
      ([layer, enabled]) => (
        <span className="layer-display" key={layer}>
          <span className="layer-text"> {layer} </span>
          <input
            className="layer-dial"
            type="radio"
            value={layer}
            disabled={!enabled}
            onChange={() => props.onLayerSelect(layer)}
            checked={
              props.selectedLayer !== undefined && props.selectedLayer == layer
            }
          />
        </span>
      )
    )}
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(MapOptions);
