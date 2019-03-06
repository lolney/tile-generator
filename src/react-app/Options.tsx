import React from "react";

interface Dimensions {
  width: Number;
  height: Number;
}

type GameString = "Civ V" | "Civ VI";

interface Game {
  type: GameString;
  display: String;
}

interface Options {
  dimensions: Dimensions;
  format: GameString;
}

interface OptionsProps {
  onSubmit: () => void;
  minDimensions: Dimensions;
  maxDimensions: Dimensions;
  selectedOptions: Options;
  onChange: () => Options;
  games: Array<Game>;
}

const Options: React.SFC<OptionsProps> = (props: OptionsProps) => <div />;

export default Options;
