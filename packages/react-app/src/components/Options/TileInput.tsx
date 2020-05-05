import React, { useCallback } from "react";
import { clamp } from "lodash";
import { Input, SIZE } from "baseui/input";
import { MapDimensionT } from "@tile-generator/common";
import * as colors from "../../constants/colors";

interface TileSliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
}

const TileInput: React.FC<TileSliderProps> = ({ onChange, value, ...rest }) => {
  const [typedValue, setTypedValue] = React.useState("");
  const [focused, setFocused] = React.useState(false);

  const numberValue = parseInt(typedValue);
  const isValid = MapDimensionT.is(numberValue);

  const roundToValidNumber = useCallback(() => {
    setFocused(false);
    setTypedValue("");

    if (isValid) onChange(numberValue);
    else if (!Number.isNaN(numberValue)) {
      let clamped = Math.floor(numberValue / 2) * 2;
      clamped = clamp(clamped, 10, 120);

      onChange(clamped);
    }
  }, [setFocused, setTypedValue, onChange, isValid, numberValue]);

  return (
    <Input
      endEnhancer="tiles"
      onChange={(event) => {
        setTypedValue((event.target as any).value.slice(0, 3));
      }}
      onBlur={roundToValidNumber}
      onFocus={() => setFocused(true)}
      size={SIZE.mini}
      error={!isValid}
      value={focused ? typedValue : value}
      {...rest}
      overrides={{
        Root: {
          style: {
            width: "15%",
            height: "24px",
            marginRight: "20px",
            marginLeft: "20px",
            marginTop: "8px",
            background: colors.textFieldGrey,
          },
        },
        EndEnhancer: {
          style: {
            fontFamily: "Avenir",
            fontSize: "12px",
            backgroundColor: colors.textFieldGrey,
            color: colors.textColorWhite,
          },
        },
        Input: {
          style: {
            fontFamily: "Avenir",
            fontSize: "12px",
            backgroundColor: colors.textFieldGrey,
            color: colors.textColorWhite,
          },
        },
        InputContainer: {
          style: {
            borderColor: colors.textFieldGrey,
          },
        },
      }}
    />
  );
};

export default TileInput;
