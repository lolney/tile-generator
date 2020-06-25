import React, { useCallback, useState } from "react";
import AdvancedOptions from "./AdvancedOptions";
import Options from "./Options";
import SubmitButtons from "./SubmitButtons";
import styles from "./styles.module.css";

type RouteType = "ADVANCED MAP OPTIONS" | "MAP OPTIONS";

type Route = {
  title: string;
  Component: React.ComponentType;
  buttonText: string;
  icon: string;
  to: RouteType;
};

const routes: { [A in RouteType]: Route } = {
  "ADVANCED MAP OPTIONS": {
    title: "ADVANCED LAYER CONTROLS",
    Component: AdvancedOptions,
    buttonText: "Back",
    icon: "/Back Arrow.png",
    to: "MAP OPTIONS",
  },
  "MAP OPTIONS": {
    title: "MAP SETTINGS",
    Component: Options,
    buttonText: "Advanced",
    icon: "/Gear.png",
    to: "ADVANCED MAP OPTIONS",
  },
};

const OptionsContainer = () => {
  const [routeType, setRouteType] = useState<RouteType>("MAP OPTIONS");
  const { Component, title, buttonText, icon, to } = routes[routeType];
  const navigate = useCallback(() => setRouteType(to), [setRouteType, to]);

  return (
    <>
      <a className={styles.advanced_back_container} onClick={navigate}>
        <img className={styles.advanced_back_icon} src={icon} alt="icon"></img>
        <div>{buttonText}</div>
      </a>
      <div className={styles.header}>{title}</div>
      <Component />
      <SubmitButtons />
    </>
  );
};

export default OptionsContainer;
