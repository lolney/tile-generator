import React, { useEffect, useState } from "react";
import { usePrevious } from "react-use";
import { useSelector } from "react-redux";
import { Slider } from "baseui/slider";
import * as colors from "../../constants/colors";
import { State } from "../../redux/types";
import AnimatedThumb from "../AnimatedThumb";
import styles from "./styles.module.css";

interface TileSliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
}

const Thumb: React.FC = () => <AnimatedThumb zIndex={0} />;

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
      Thumb,
    }}
  />
);

export default TileSlider;
