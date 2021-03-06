import React from "react";
import { SIZE } from "baseui/input";
import { Select } from "baseui/select";
import * as colors from "../../constants/colors";
import { GameString, gameStrings, Options } from "@tile-generator/common";
import { changeOptions } from "../../redux/modules/settings";
import { State } from "../../redux/types";
import { connect } from "react-redux";

interface SelectMenuProps {
  format: GameString;
  changeOptions: (options: Partial<Options>) => void;
}

const mapStateToProps = (state: State) => ({
  format: state.settings.format,
});

const mapDispatchToProps = {
  changeOptions,
};

const formatDisplayNames: { [k in GameString]: string } = {
  "Civ V": "Civilization V",
  "Civ VI": "Civilization VI",
};

const options = gameStrings.map((format) => ({
  id: format,
  label: formatDisplayNames[format],
}));

const SelectMenu: React.FC<SelectMenuProps> = ({ format, changeOptions }) => (
  <Select
    clearable={false}
    size={SIZE.mini}
    value={[{ id: format }]}
    options={options}
    searchable={false}
    onChange={(val) => changeOptions({ format: val.value[0].id as GameString })}
    overrides={{
      Popover: {
        props: {
          overrides: {
            Body: { style: () => ({ zIndex: 200 }) },
          },
        },
      },
      Root: {
        style: () => ({
          width: "352.172px", // temp fix; doesn't work with all browsers
          height: "10px",
          marginTop: "10px",
          marginLeft: "1px",  // temp fix; doesn't work with all browsers
          padding: "0px",
          background: colors.textFieldGrey,
          borderRadius: "2px",
          "@media screen and (max-width: 414px)": { // temp fix; doesn't work with all browsers. Same with @media screens below
            width: "226px",
            marginLeft: "0px",
          },
          "@media screen and (max-width: 411px)": { width: "224.75px" },
          "@media screen and (max-width: 375px)": { width: "192.859px" },
          "@media screen and (max-width: 360px)": { width: "177.578px" },
          "@media screen and (max-width: 320px)": { width: "137.39px" },
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectMenu);
