import Map from "./Map";
import OptionsMenu from "./Options";
import React from "react";
import { MapOptions, Options, Tile } from "../common/types";
import { LatLng, LatLngBounds } from "leaflet";
import { Polygon } from "geojson";

type State = {
  options: MapOptions;
  grid: Array<Polygon>;
  activeJob: boolean;
  layer: Array<Tile>;
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
    layer: []
  };

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
    this.setState({ grid: res.grid });

    let remainingLayers = res.nLayers;
    let eventSource = new EventSource(`updates/${res.id}`);

    const callback = (e: Event) => {
      // @ts-ignore
      const data = JSON.parse(e.data);
      this.setState({ layer: data.layer });
      remainingLayers--;

      if (remainingLayers == 0) {
        eventSource.removeEventListener("layer", callback);

        this.resetState();
      }
    };

    eventSource.addEventListener("layer", callback);
  }

  resetState() {
    this.setState({
      grid: [],
      activeJob: false,
      layer: []
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
          layer={this.state.layer}
          grid={this.state.grid}
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
