import React from "react";
import { clamp } from "lodash";
import { Input, SIZE } from "baseui/input";
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
  const isValid = numberValue >= 10 && numberValue <= 120;

  return (
    <Input
      endEnhancer="tiles"
      onChange={(event) => {
        setTypedValue((event.target as any).value.slice(0, 3));
      }}
      onBlur={() => {
        setFocused(false);
        setTypedValue("");

        if (isValid) onChange(numberValue);
        else if (!Number.isNaN(numberValue)) {
          const clamped = clamp(numberValue, 10, 120);
          onChange(clamped);
        }
      }}
      onFocus={() => setFocused(true)}
      size={SIZE.mini}
      error={!isValid}
      value={focused ? typedValue : value}
      {...rest}
      overrides={{
        Root: {
          style: () => ({
            width: "15%",
            height: "24px",
            marginRight: "20px",
            marginLeft: "20px",
            marginTop: "8px",
            background: colors.textFieldGrey,
          }),
        },
        EndEnhancer: {
          style: () => ({
            fontFamily: "Avenir",
            fontSize: "12px",
            backgroundColor: colors.textFieldGrey,
            color: colors.textColorWhite,
          }),
        },
        Input: {
          style: () => ({
            fontFamily: "Avenir",
            fontSize: "12px",
            backgroundColor: colors.textFieldGrey,
            color: colors.textColorWhite,
          }),
        },
        InputContainer: {
          style: () => ({
            borderColor: colors.textFieldGrey,
          }),
        },
      }}
    />
  );
};

export default TileInput;