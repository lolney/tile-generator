import Map from "./Map";
import OptionsMenu from "./Options";
import React from "react";
import { MapOptions, Options, LayersType, MapLayers } from "../common/types";
import { LatLng, LatLngBounds, layerGroup } from "leaflet";
import { Polygon } from "geojson";
import download from "downloadjs";
import { NumberType } from "io-ts";

type State = {
  options: MapOptions;
  grid: Array<Polygon>;
  activeJob: boolean;
  layers: LayersType;
  loadingLayer?: string;
};

export default class AppContainer extends React.Component {
  state: State = {
    options: {
      dimensions: { width: 10, height: 10 },
      format: "Civ V",
      bounds: new LatLngBounds(new LatLng(37, -121), new LatLng(38, -120))
    },
    grid: [],
    activeJob: false,
    layers: {}
  };

  // todo: make lifecycle more explicit
  // begin: enter 'activeJob' state
  // on fetch: reset grid and layers. create listener for updates
  // on recive update: update layer
  // on updates complete: leave 'activeJob' state
  async onSubmit() {
    if (this.state.activeJob) {
      console.log("job currently active");
      return;
    }

    console.log("submitted" + JSON.stringify(this.state.options));
    this.setState({ activeJob: true });
    const response = await fetch("/api/map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.options)
    }).catch(e => {
      this.resetState();
      throw e;
    });

    const res = await response.json();
    const layerCounter = new LayerCounter();
    this.setState({
      grid: res.grid,
      layers: {},
      loadingLayer: layerCounter.next()
    });

    let eventSource = new EventSource(`updates/${res.id}`);

    const callback = (e: Event) => {
      // @ts-ignore
      const data = JSON.parse(e.data);
      const loadingLayer = layerCounter.next();
      this.setState({
        layers: { ...this.state.layers, ...data.layer },
        loadingLayer
      });

      if (loadingLayer === undefined) {
        eventSource.removeEventListener("layer", callback);

        fetch(`/api/map/${res.id}`)
          .then(async resp => ({
            // @ts-ignore (enforced on server)
            filename: resp.headers
              .get("Content-Disposition")
              .split("filename=")[1],
            blob: await resp.blob()
          }))
          .then(function({ filename, blob }) {
            download(blob, filename);
          });
        this.resetState();
      }
    };

    eventSource.addEventListener("layer", callback);
  }

  resetState() {
    this.setState({
      activeJob: false
    });
  }

  render() {
    return (
      <React.Fragment>
        <Map
          onBoundsChange={(bounds: LatLngBounds) => {
            if (!this.state.activeJob) {
              this.setState({ options: { ...this.state.options, bounds } });
            }
          }}
          layers={this.state.layers}
          grid={this.state.grid}
          loadingLayer={this.state.loadingLayer}
        />
        <OptionsMenu
          onChange={(options: Options) => {
            this.setState({ options: { ...this.state.options, ...options } });
          }}
          selectedOptions={{
            format: this.state.options.format,
            dimensions: this.state.options.dimensions
          }}
          minDimensions={{ width: 10, height: 10 }}
          maxDimensions={{ width: 120, height: 120 }}
          onSubmit={this.onSubmit.bind(this)}
        />
      </React.Fragment>
    );
  }
}

class LayerCounter {
  index: number;
  layers: Array<string>;

  constructor() {
    this.layers = Object.values(MapLayers).filter(
      layer => typeof layer === "string"
    );
    this.index = 0;
  }

  next() {
    if (this.index === layerGroup.length) return undefined;
    else {
      const result = this.layers[this.index];
      this.index++;
      return result;
    }
  }
}
