import Map from "./Map";
import OptionsMenu from "./Options";
import React from "react";
import { State, Options } from "./types";
import { LatLng, LatLngBounds } from "leaflet";

export default class AppContainer extends React.Component {
  state: State = {
    dimensions: { width: 500, height: 50 },
    format: "Civ V",
    bounds: new LatLngBounds(new LatLng(37, -121), new LatLng(38, -120))
  };

  onSubmit() {
    // submit state
  }

  render() {
    return (
      <React.Fragment>
        <Map
          onBoundsChange={(bounds: LatLngBounds) => this.setState({ bounds })}
        />
        <OptionsMenu
          onChange={(options: Options) => {
            this.setState({ ...this.state, options });
          }}
          selectedOptions={{
            format: this.state.format,
            dimensions: this.state.dimensions
          }}
          minDimensions={{ width: 10, height: 10 }}
          maxDimensions={{ width: 120, height: 120 }}
          onSubmit={this.onSubmit.bind(this)}
        />
      </React.Fragment>
    );
  }
}
