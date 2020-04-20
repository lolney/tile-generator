import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "normalize.css";
import { MapPage } from "./react-app/pages/MapPage";
import { About } from "./react-app/pages/About";
import { Help } from "./react-app/pages/Help";

import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import { store } from "./react-app/redux/store";

ReactDOM.render(
  <Provider store={store()}>
    <Help />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
