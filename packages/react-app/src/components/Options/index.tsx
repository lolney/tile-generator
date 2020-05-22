import React from "react";
import { Options } from "@tile-generator/common";
import { submit } from "../../redux/modules/map";
import { changeOptions, resetOptions } from "../../redux/modules/settings";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import InputRow from "./InputRow";
import SelectMenu from "./SelectMenu";
import { ControlButtons } from "../ControlButtons";
import styles from "./styles.module.css";
import Button from "../Button";
import { reachedLimit } from "../../redux/modules/toolbar";

const widthParams = { min: 10, max: 120 };

interface OptionsProps {
  onSubmit: () => void;
  selectedOptions: Options;
  limitReached: boolean;
  onChange: (options: Options) => void;
  resetOptions: () => void;
}

const mapStateToProps = (state: State) => ({
  selectedOptions: {
    format: state.settings.format,
    dimensions: state.settings.dimensions,
  },
  limitReached: reachedLimit(state),
});

const mapDispatchToProps = {
  onChange: changeOptions,
  onSubmit: submit,
  resetOptions,
};

export const OptionsComponent: React.FC<OptionsProps> = ({
  limitReached,
  onChange,
  onSubmit,
  selectedOptions,
  resetOptions,
}) => {
  return (
    <>
      <div className={styles.header}>MAP OPTIONS</div>
      {(["width", "height"] as Array<"width" | "height">).map((title) => (
        <InputRow
          selectedOptions={selectedOptions}
          onChange={onChange}
          title={title}
          field={title}
          key={title}
          {...widthParams}
        />
      ))}
      <div className={styles.horizontal_containers}>
        <div className={styles.left_header_container}>
          <div className={styles.left_headers}>Format</div>
        </div>
        <SelectMenu />
      </div>
      <ControlButtons>
        <Button primary disabled={limitReached} onClick={onSubmit}>
          Generate
        </Button>
        <Button onClick={resetOptions}>Reset</Button>
      </ControlButtons>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsComponent);
