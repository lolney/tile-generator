import React from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider, LightTheme } from "baseui";

const engine = new Styletron();

export const BaseWeb: React.FC = ({ children }) => (
  <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>{children}</BaseProvider>
  </StyletronProvider>
);

export default BaseWeb;
