import React, { useState } from "react";
import { Dimensions, Options, GameString, gameStrings } from "./types";

// @ts-ignore: noImplicitAny
import ControlPanel, { Select, Range } from "react-control-panel";

interface OptionsProps {
  onSubmit: () => void;
  minDimensions: Dimensions;
  maxDimensions: Dimensions;
  selectedOptions: Options;
  onChange: (options: Options) => void;
}

type State = {
  Width: number;
  Height: number;
  Format: GameString;
};

type ControlPanelProps = State & {
  minDimensions: Dimensions;
  maxDimensions: Dimensions;
  onChange: (newState: any) => void;
};

const OptionsWrapper: React.SFC<OptionsProps> = props => {
  const selected = props.selectedOptions;

  const [state, setState] = useState({
    Width: selected.dimensions.width,
    Height: selected.dimensions.height,
    Format: selected.format
  });

  return (
    <div>
      <OptionsMenu
        {...state}
        minDimensions={props.minDimensions}
        maxDimensions={props.maxDimensions}
        onChange={(newState: State) => {
          setState({ ...state, ...newState });
        }}
      />
      <button onClick={props.onSubmit}> Submit </button>
    </div>
  );
};

const OptionsMenu: React.SFC<ControlPanelProps> = props => (
  <ControlPanel
    theme="dark"
    title="Demo Panel"
    initialState={{
      Width: props.Width,
      Height: props.Height,
      Format: props.Format
    }}
    onChange={(label: string, newvalue: any) => {
      props.onChange({ [label]: newvalue });
    }}
    width={500}
    style={{ marginRight: 30 }}
  >
    <Range
      label="Width"
      step={1}
      min={props.minDimensions.width}
      max={props.maxDimensions.width}
    />
    <Range
      label="Height"
      step={1}
      min={props.minDimensions.height}
      max={props.maxDimensions.height}
    />
    <Select label="Format" options={gameStrings} />
  </ControlPanel>
);

export default OptionsWrapper;
