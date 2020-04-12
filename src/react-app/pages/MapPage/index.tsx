import React from "react";
import styles from "styles.module.css";
import Map from "../../v2-components/Map";
import Dock from "../../v2-components/Dock";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import {
  DarkTheme,
  BaseProvider,
  styled,
  createTheme,
  LightTheme,
} from "baseui";
/* adding colors as necessary instead of `customColor`  */

import { StatefulInput } from "baseui/input";

const engine = new Styletron();

type CustomThemeT = typeof LightTheme & {
  backgroundGrey: string;
  textFieldGrey: string;
  textColorWhite: string;
};
const customTheme: CustomThemeT = {
  ...LightTheme,
  backgroundGrey: "#232323",
  textFieldGrey: "#363636",
  textColorWhite: "#ebebeb",
};

export const MapPage: React.FC = () => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={DarkTheme}>
      <Map />
      <Dock />
    </BaseProvider>
  </StyletronProvider>
);
