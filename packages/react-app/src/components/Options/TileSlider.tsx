import React from "react";
import { Slider } from "baseui/slider";
import * as colors from "../../constants/colors";

interface TileSliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
}

const TileSlider: React.FC<TileSliderProps> = ({
  value,
  onChange,
  ...rest
}) => (
  <Slider
    value={[value]}
    step={2}
    onChange={(e) => onChange(e.value[0])}
    {...rest}
    overrides={{
      Root: {
        style: () => ({
          width: "75%",
          height: "16px",
        }),
      },
      Track: {
        style: () => ({
          paddingTop: "8px",
          paddingLeft: "1px",
          paddingRight: "1px",
          paddingBottom: "5px",
          marginRight: "0px",
        }),
      },
      TickBar: () => null,
      InnerThumb: () => null,
      ThumbValue: () => null,
      InnerTrack: {
        style: () => ({
          background: colors.textFieldGrey,
          height: "24px",
        }),
      },
      Thumb: {
        style: () => ({
          height: "18px",
          width: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderStyle: "solid",
          borderWidth: "3px",
          borderColor: "#ccc",
          backgroundColor: "#fff",
        }),
      },
    }}
  />
);

export default TileSlider;
