import React from "react";
import { SIZE } from "baseui/input";
import { Select } from "baseui/select";
import * as colors from "../../constants/colors";
import {
  Civ5MapSize,
  Civ6MapSize,
  Dimensions,
  GameString,
  Options,
  SizeString,
  sizeStrings,
} from "@tile-generator/common";
import { changeOptions } from "../../redux/modules/settings";
import { State } from "../../redux/types";
import { connect } from "react-redux";

interface SelectSizeProps {
  dimensions: Dimensions;
  format: GameString;
  changeOptions: (options: Partial<Options>) => void;
}

const mapStateToProps = (state: State) => ({
  format: state.settings.format,
  dimensions: state.settings.dimensions,
});

const mapDispatchToProps = {
  changeOptions,
};

const formatDisplayNames: { [k in SizeString]: string } = {
  MAPSIZE_DUEL: "Duel",
  MAPSIZE_TINY: "Tiny",
  MAPSIZE_SMALL: "Small",
  MAPSIZE_STANDARD: "Standard",
  MAPSIZE_LARGE: "Large",
  MAPSIZE_HUGE: "Huge",
};

const options = sizeStrings.map((format: SizeString) => ({
  id: format,
  label: formatDisplayNames[format],
}));

const getSize = (format: GameString, dimensions: Dimensions): SizeString => {
  switch (format) {
    case "Civ V":
      return Civ5MapSize.dimensionsToMapSize(dimensions);
    case "Civ VI":
      return Civ6MapSize.dimensionsToMapSize(dimensions);
  }
};

const getDimensions = (format: GameString, size: SizeString) => {
  switch (format) {
    case "Civ V":
      return Civ5MapSize.mapSizes[size];
    case "Civ VI":
      return Civ6MapSize.mapSizes[size];
  }
};

const SelectSize: React.FC<SelectSizeProps> = ({
  dimensions,
  format,
  changeOptions,
}) => {
  const size = React.useMemo(() => getSize(format, dimensions), [
    dimensions,
    format,
  ]);

  return (
    <Select
      clearable={false}
      size={SIZE.mini}
      value={[{ id: size }]}
      options={options}
      searchable={false}
      onChange={(val) =>
        changeOptions({
          dimensions: getDimensions(format, val?.option?.id as SizeString),
        })
      }
      overrides={{
        Popover: {
          props: {
            overrides: {
              Body: { style: () => ({ zIndex: 0 }) },
            },
          },
        },
        Root: {
          style: () => ({
            width: "70.83px",
            height: "10px",
            marginTop: "10px",
            marginLeft: "21px",
            padding: "0px",
            background: colors.textFieldGrey,
            borderRadius: "2px",
            "@media screen and (max-width: 414px)": { width: "76px" },
            "@media screen and (max-width: 411px)": { width: "75.25px" },
            "@media screen and (max-width: 375px)": { width: "70.141px" },
            "@media screen and (max-width: 360px)": { width: "71.42px" },
            "@media screen and (max-width: 320px)": { width: "70.61px" },
          }),
        },
        ValueContainer: {
          style: () => ({
            paddingLeft: "10px",
            background: colors.textFieldGrey,
            color: colors.textColorWhite,
          }),
        },
        ControlContainer: {
          style: () => ({
            borderRadius: "2px",
            border: "none",
            backgroundColor: colors.textFieldGrey,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectSize);
