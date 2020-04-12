import React from "react";
import { Slider } from "baseui/slider";
import { Input, SIZE } from "baseui/input";
import { Select } from "baseui/select";
import styles from "./styles.module.css";

const TileSlider: React.FC = () => (
  <Slider
    value={[23]}
    onChange={({ value }) => {}}
    onFinalChange={({ value }) => console.log(value)}
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
        style: ({ $theme }) => ({
          background: $theme.textFieldGrey,
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

const TileInput: React.FC = () => (
  <Input
    endEnhancer="tiles"
    size={SIZE.mini}
    overrides={{
      Root: {
        style: ({ $theme }) => ({
          width: "15%",
          height: "24px",
          marginRight: "20px",
          marginLeft: "20px",
          marginTop: "8px",
          background: $theme.textFieldGrey,
        }),
      },
      EndEnhancer: {
        style: ({ $theme }) => ({
          fontFamily: "Avenir",
          fontSize: "12px",
          backgroundColor: $theme.textFieldGrey,
          color: $theme.textColorWhite,
        }),
      },
      Input: {
        style: ({ $theme }) => ({
          fontFamily: "Avenir",
          fontSize: "12px",
          backgroundColor: $theme.textFieldGrey,
          color: $theme.textColorWhite,
        }),
      },
      InputContainer: {
        style: ({ $theme }) => ({
          borderColor: $theme.textFieldGrey,
        }),
      },
    }}
  />
);

const SelectMenu: React.FC = () => (
  <Select
    size={SIZE.mini}
    options={[{ id: "Civilization VI" }, { id: "Civilization V" }]}
    labelKey="id"
    overrides={{
      Root: {
        style: ({ $theme }) => ({
          width: "100%",
          height: "10px",
          marginTop: "10px",
          marginLeft: "7.19px",
          marginRight: "112.25px",
          padding: "0px",
          background: $theme.textFieldGrey,
        }),
      },
      ValueContainer: {
        style: ({ $theme }) => ({
          padding: "0px",
          background: $theme.textFieldGrey,
        }),
      },
      ControlContainer: {
        style: ({ $theme }) => ({
          borderColor: $theme.textFieldGrey,
        }),
      },
      IconsContainer: {
        style: ({ $theme }) => ({
          background: $theme.textFieldGrey,
          borderColor: $theme.textFieldGrey,
          border: "0px",
        }),
      },
      SelectArrow: {
        style: ({ $theme }) => ({
          color: $theme.textColorWhite,
        }),
      },
      DropdownContainer: {
        style: ({ $theme }) => ({
          backgroundColor: $theme.textFieldGrey,
        }),
      },
      Dropdown: {
        style: ({ $theme }) => ({
          backgroundColor: $theme.textFieldGrey,
          paddingBottom: "0px",
          paddingTop: "0px",
        }),
      },
      DropdownListItem: {
        style: ({ $theme }) => ({
          backgroundColor: $theme.textFieldGrey,
          paddingBottom: "4px",
          paddingTop: "4px",
        }),
      },
      OptionContent: {
        style: ({ $theme }) => ({
          color: $theme.textColorWhite,
          fontFamily: "Avenir",
          fontSize: "12px",
        }),
      },
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
    <div className={styles.btn_container}>
      <button className={styles.primary_btm_button}>Generate</button>
      <button className={styles.btm_buttons}>Reset</button>
    </div>
  </>
);

export default Options;
