import React from "react";
import styles from "styles.module.css";
import Map from "../../v2-components/Map";
import Dock from "../../v2-components/Dock";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
import { StatefulInput } from "baseui/input";

const engine = new Styletron();

export const MapPage: React.FC = () => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>
      <Map />
      <Dock />
    </BaseProvider>
  </StyletronProvider>
);
