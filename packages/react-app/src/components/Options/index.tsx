import React, { useCallback, useState } from "react";
import AdvancedOptions from "./AdvancedOptions";
import Options from "./Options";
import SubmitButtons from "./SubmitButtons";
import styles from "./styles.module.css";

type RouteType = "ADVANCED MAP OPTIONS" | "MAP OPTIONS";

type Route = {
  title: RouteType;
  Component: React.ComponentType;
  buttonText: string;
  to: RouteType;
};

const routes: { [A in RouteType]: Route } = {
  "ADVANCED MAP OPTIONS": {
    title: "ADVANCED MAP OPTIONS",
    Component: AdvancedOptions,
    buttonText: "< Back",
    to: "MAP OPTIONS",
  },
  "MAP OPTIONS": {
    title: "MAP OPTIONS",
    Component: Options,
    buttonText: "Advanced",
    to: "ADVANCED MAP OPTIONS",
  },
};

const OptionsContainer = () => {
  const [routeType, setRouteType] = useState<RouteType>("MAP OPTIONS");
  const { Component, title, buttonText, to } = routes[routeType];
  const navigate = useCallback(() => setRouteType(to), [setRouteType, to]);

  return (
    <>
      <a className={styles.advanced_back} onClick={navigate}>
        {buttonText}
      </a>
      <div className={styles.header}>{title}</div>
      <Component />
      <SubmitButtons />
    </>
  );
};

export default OptionsContainer;
