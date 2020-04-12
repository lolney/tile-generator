import React from "react";
import { Slider } from "baseui/slider";
import { Input, SIZE } from "baseui/input";
import { Select } from "baseui/select";
import styles from "./styles.module.css";
import * as colors from "../../constants/colors";
import ControlButtons from "../ControlButtons";

const TileSlider: React.FC = () => (
  <Slider
    value={[23]}
    onChange={({ value }) => {}}
    onFinalChange={({ value }) => console.log(value)}
    overrides={{
      Root: {
        style: () => ({
          width: "75%",
          height: "16px"
        })
      },
      Track: {
        style: () => ({
          paddingTop: "8px",
          paddingLeft: "1px",
          paddingRight: "1px",
          paddingBottom: "5px",
          marginRight: "0px"
        })
      },
      TickBar: () => null,
      InnerThumb: () => null,
      ThumbValue: () => null,
      InnerTrack: {
        style: () => ({
          background: colors.textFieldGrey,
          height: "24px"
        })
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
          backgroundColor: "#fff"
        })
      }
    }}
  />
);

const TileInput: React.FC = () => (
  <Input
    endEnhancer="tiles"
    size={SIZE.mini}
    overrides={{
      Root: {
        style: () => ({
          width: "15%",
          height: "24px",
          marginRight: "20px",
          marginLeft: "20px",
          marginTop: "8px",
          background: colors.textFieldGrey
        })
      },
      EndEnhancer: {
        style: () => ({
          fontFamily: "Avenir",
          fontSize: "12px",
          backgroundColor: colors.textFieldGrey,
          color: colors.textColorWhite
        })
      },
      Input: {
        style: () => ({
          fontFamily: "Avenir",
          fontSize: "12px",
          backgroundColor: colors.textFieldGrey,
          color: colors.textColorWhite
        })
      },
      InputContainer: {
        style: () => ({
          borderColor: colors.textFieldGrey
        })
      }
    }}
  />
);

const SelectMenu: React.FC = () => (
  <Select
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
          marginLeft: "7.19px",
          marginRight: "112.25px",
          padding: "0px",
          background: colors.textFieldGrey
        })
      },
      ValueContainer: {
        style: () => ({
          padding: "0px",
          background: colors.textFieldGrey,
          color: colors.textColorWhite
        })
      },
      ControlContainer: {
        style: () => ({
          borderColor: colors.textFieldGrey
        })
      },
      IconsContainer: {
        style: () => ({
          background: colors.textFieldGrey,
          borderColor: colors.textFieldGrey,
          border: "0px"
        })
      },
      SelectArrow: {
        style: () => ({
          color: colors.textColorWhite
        })
      },
      DropdownContainer: {
        style: () => ({
          backgroundColor: colors.textFieldGrey
        })
      },
      Dropdown: {
        style: () => ({
          backgroundColor: colors.textFieldGrey,
          paddingBottom: "0px",
          paddingTop: "0px"
        })
      },
      DropdownListItem: {
        style: () => ({
          backgroundColor: colors.textFieldGrey,
          paddingBottom: "4px",
          paddingTop: "4px"
        })
      },
      OptionContent: {
        style: () => ({
          color: colors.textColorWhite,
          fontFamily: "Avenir",
          fontSize: "12px"
        })
      }
    }}
  />
);

export const Options: React.FC = () => (
  <>
    <div className={styles.header}>MAP OPTIONS</div>
    <div className={styles.horizontal_containers}>
      <div className={styles.left_headers}>Width</div>
      <TileSlider />
      <TileInput />
    </div>
    <div className={styles.horizontal_containers}>
      <div className={styles.left_headers}>Height</div>
      <TileSlider />
      <TileInput />
    </div>
    <div className={styles.horizontal_containers}>
      <div className={styles.left_headers}>Format</div>
      <SelectMenu />
    </div>
    <ControlButtons textPrimary={"Generate"} textSecondary={"Reset"} />
  </>
);

export default Options;
