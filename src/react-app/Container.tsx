import Map from "./Map";
import OptionsMenu from "./Options";
import React from "react";
import { MapOptions, Options } from "../common/types";
import { LatLng, LatLngBounds } from "leaflet";
import { Polygon } from "geojson";

type State = {
  options: MapOptions;
  grid: Array<Polygon>;
};

export default class AppContainer extends React.Component {
  state: State = {
    options: {
      dimensions: { width: 10, height: 10 },
      format: "Civ V",
      bounds: new LatLngBounds(new LatLng(37, -121), new LatLng(38, -120))
    },
    grid: []
  };

  async onSubmit() {
    console.log("submitted" + JSON.stringify(this.state));
    const response = await fetch("/api/map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.options)
    });

    const grid = await response.json();

    this.setState({ grid: grid.data });
  }

  render() {
    return (
      <React.Fragment>
        <Map
          onBoundsChange={(bounds: LatLngBounds) =>
            this.setState({ options: { bounds } })
          }
          grid={this.state.grid}
        />
        <OptionsMenu
          onChange={(options: Options) => {
            this.setState({ ...this.state, options });
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
