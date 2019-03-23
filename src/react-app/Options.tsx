import React from "react";
import { Dimensions, Options, GameString, gameStrings } from "../common/types";

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

type ControlPanelProps = {
  state: State;
  minDimensions: Dimensions;
  maxDimensions: Dimensions;
  onChange: (newState: State) => void;
};

function stateToOptions(state: State): Options {
  return {
    dimensions: { width: state.Width, height: state.Height },
    format: state.Format
  };
}

const OptionsWrapper: React.SFC<OptionsProps> = props => {
  const Width = props.selectedOptions.dimensions.width;
  const Height = props.selectedOptions.dimensions.width;
  const Format = props.selectedOptions.format;

  return (
    <div>
      <OptionsMenu
        state={{ Width, Height, Format }}
        minDimensions={props.minDimensions}
        maxDimensions={props.maxDimensions}
        onChange={(newState: State) => {
          props.onChange(stateToOptions(newState));
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
