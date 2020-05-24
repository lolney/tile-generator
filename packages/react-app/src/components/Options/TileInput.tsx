import React, { useCallback } from "react";
import { clamp } from "lodash";
import { Input, SIZE, StyledInputContainer } from "baseui/input";
import { MapDimensionT } from "@tile-generator/common";
import * as colors from "../../constants/colors";
import { ThemeProvider } from "baseui";
import { withStyle } from "baseui";

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
            "@media screen and (max-width: 414px)": { width: "25%" },
            "@media screen and (max-width: 411px)": { width: "25%" },
            "@media screen and (max-width: 375px)": { width: "27%" },
            "@media screen and (max-width: 360px)": { width: "30%" },
            "@media screen and (max-width: 320px)": { width: "38%" },
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
            caretColor: colors.textColorWhite,
          },
        },
        InputContainer: {
          style: {
            backgroundColor: colors.textFieldGrey,
            border: "none",
          },
        },
      }}
    />
  );
};

export default TileInput;
