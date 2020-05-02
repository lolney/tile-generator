import React from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import ReactDOM from "react-dom";
import styles from "./index.module.css";
import "normalize.css";
import { MapPage } from "./pages/MapPage";
import { About } from "./pages/About";
import { Help } from "./pages/Help";

import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import { store } from "./redux/store";

ReactDOM.render(
  <Provider store={store()}>
    <BrowserRouter>
      <div className={styles.top_bar}>
        <div className={styles.header_container}>
          <NavLink to="/" className={styles.header}>
            <img className={styles.logo} src="/logo.svg" alt="logo"></img>
            <header>Civilization Tile Builder</header>
          </NavLink>
        </div>
        <div className={styles.space}></div>
        <div className={styles.menu_item_container}>
          <div className={styles.button_container}>
            <NavLink
              to="/About"
              className={styles.menu_item}
              activeClassName={styles.menu_item_selected}
            >
              About
            </NavLink>
          </div>
          <div className={styles.button_container}>
            <NavLink
              to="/Help"
              className={styles.menu_item}
              activeClassName={styles.menu_item_selected}
            >
              Help
            </NavLink>
          </div>
        </div>
      </div>
      <Route exact path="/">
        <MapPage></MapPage>
      </Route>
      <Route path="/About">
        <About></About>
      </Route>
      <Route path="/Help">
        <Help></Help>
      </Route>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
