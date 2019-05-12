import React, { Component } from "react";
import { OptionsContainer } from "./Container";
import Header from "./Header";
import "./App.css";
import MapContainer from "./MapContainer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <MapContainer />
        <OptionsContainer />
      </div>
    );
  }
}

export default App;
