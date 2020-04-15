import React from "react";
import { Options } from "../../../common/types";
import { submit } from "../../redux/modules/map";
import { changeOptions } from "../../redux/modules/settings";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import { TileSlider, TileInput, SelectMenu } from "./BaseOptions";
import { ControlButtons } from "../ControlButtons";
import styles from "./styles.module.css";

const widthParams = { min: 10, max: 120 };

interface OptionsProps {
  onSubmit: () => void;
  selectedOptions: Options;
  onChange: (options: Options) => void;
}

const mapStateToProps = (state: State) => ({
  selectedOptions: {
    format: state.settings.format,
    dimensions: state.settings.dimensions,
  },
});

const mapDispatchToProps = {
  onChange: changeOptions,
  onSubmit: submit,
};

export const OptionsComponent: React.FC<OptionsProps> = ({
  onChange,
  onSubmit,
  selectedOptions,
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
          {...widthParams}
        />
      ))}
      <div className={styles.horizontal_containers}>
        <div className={styles.left_headers}>Format</div>
        <SelectMenu />
      </div>
      <ControlButtons
        clickPrimary={onSubmit}
        textPrimary={"Generate"}
        textSecondary={"Reset"}
      />
    </>
  );
};

interface InputRowProps {
  title: string;
  min: number;
  max: number;
  selectedOptions: Options;
  onChange: (options: Options) => void;
  field: "width" | "height";
}

const InputRow: React.FC<InputRowProps> = ({
  selectedOptions,
  min,
  max,
  title,
  field,
  onChange,
}) => {
  const props = {
    value: selectedOptions.dimensions[field],
    min,
    max,
    onChange: (value: number) => {
      console.log(value);
      return onChange({
        ...selectedOptions,
        dimensions: { ...selectedOptions.dimensions, [field]: value },
      });
    },
  };
  return (
    <div className={styles.horizontal_containers}>
      <div className={styles.left_headers}>{title}</div>
      <TileSlider {...props} />
      <TileInput {...props} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsComponent);
