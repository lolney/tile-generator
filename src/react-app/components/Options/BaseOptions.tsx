import React from "react";
import { Slider } from "baseui/slider";
import { Input, SIZE } from "baseui/input";
import { Select } from "baseui/select";
import * as colors from "../../constants/colors";

interface TileSliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
}

export const TileSlider: React.FC<TileSliderProps> = ({
  value,
  onChange,
  ...rest
}) => (
  <Slider
    value={[value]}
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

export const TileInput: React.FC<TileSliderProps> = ({ onChange, ...rest }) => (
  <Input
    endEnhancer="tiles"
    type="number"
    onChange={(event) => onChange((event.target as any).value)}
    size={SIZE.mini}
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

export const SelectMenu: React.FC = () => (
  <Select
    clearable={false}
    size={SIZE.mini}
    value={[{ id: "Civilization VI" }]}
    options={[{ id: "Civilization VI" }, { id: "Civilization V" }]}
    labelKey="id"
    overrides={{
      Root: {
        style: () => ({
          width: "100%",
          height: "10px",
          marginTop: "10px",
          marginLeft: "6.19px",
          marginRight: "111.25px",
          padding: "0px",
          background: colors.textFieldGrey,
          borderRadius: "2px",
        }),
      },
      ValueContainer: {
        style: () => ({
          padding: "0px",
          background: colors.textFieldGrey,
          color: colors.textColorWhite,
        }),
      },
      ControlContainer: {
        style: () => ({
          borderRadius: "2px",
          borderColor: colors.textFieldGrey,
        }),
      },
      IconsContainer: {
        style: () => ({
          background: colors.textFieldGrey,
          borderColor: colors.textFieldGrey,
          border: "0px",
        }),
      },
      SelectArrow: {
        style: () => ({
          color: colors.textColorWhite,
        }),
      },
      DropdownContainer: {
        style: () => ({
          backgroundColor: colors.textFieldGrey,
        }),
      },
      SearchIconContainer: {
        style: () => ({
          borderRadius: "2px",
        }),
      },
      Dropdown: {
        style: () => ({
          backgroundColor: colors.textFieldGrey,
          paddingBottom: "0px",
          paddingTop: "0px",
        }),
      },
      DropdownListItem: {
        style: () => ({
          backgroundColor: colors.textFieldGrey,
          paddingBottom: "4px",
          paddingTop: "4px",
        }),
      },
      OptionContent: {
        style: () => ({
          color: colors.textColorWhite,
          fontFamily: "Avenir",
          fontSize: "12px",
        }),
      },
    }}
  />
);
