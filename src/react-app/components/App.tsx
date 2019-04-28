import React, { Component } from "react";
import { OptionsContainer, MapContainer } from "./Container";
import Header from "./Header";
import "./App.css";

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
