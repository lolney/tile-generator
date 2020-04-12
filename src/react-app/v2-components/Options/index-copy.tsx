import React from "react";
import styles from "./styles.module.css";

// @ts-ignore: noImplicitAny
import ControlPanel, { Select, Range } from "react-control-panel";
import { GameString, Dimensions, gameStrings } from "../../../common/types";

type State = {
  Width: number;
  Height: number;
  Format: GameString;
};

type ControlPanelProps = {
  state: State;
  minDimensions: Dimensions;
  maxDimensions: Dimensions;
  onChange: (newState: State) => void;
};

const OptionsMenu: React.SFC<ControlPanelProps> = (props) => (
  <ControlPanel
    theme="dark"
    initialState={props.state}
    onChange={(label: string, newvalue: any) => {
      props.onChange({ ...props.state, [label]: newvalue });
    }}
    width={500}
    style={{ marginRight: 30 }}
  >
    <Range
      label="Width"
      step={1}
      min={props.minDimensions.width}
      max={props.maxDimensions.width}
      style={{ marginTop: 20 }}
    />
    <Range
      label="Height"
      step={1}
      min={props.minDimensions.height}
      max={props.maxDimensions.height}
    />
    <Select label="Format" options={gameStrings} style={{ marginTop: 200 }} />
  </ControlPanel>
);

export const Options: React.FC = () => (
  <>
    <div className={styles.header}>MAP OPTIONS</div>
    <div className={styles.left_headers}>Width</div>
    <div className={styles.left_headers}>Height</div>
    <div className={styles.left_headers}>Format</div>
    <OptionsMenu
      state={{ Width: 50, Height: 30, Format: "Civ VI" }}
      minDimensions={{ width: 10, height: 10 }}
      maxDimensions={{ width: 100, height: 100 }}
      onChange={(newState: State) => {}}
    />
    <div className={styles.btn_container}>
      <button className={styles.primary_btm_button}>Generate</button>
      <button className={styles.btm_buttons}>Reset</button>
    </div>
  </>
);

export default Options;
