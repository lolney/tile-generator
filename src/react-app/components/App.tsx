import React, { Component } from "react";
import { OptionsContainer, MapContainer } from "./Container";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <MapContainer />
        <OptionsContainer />
      </div>
    );
  }
}

export default App;
