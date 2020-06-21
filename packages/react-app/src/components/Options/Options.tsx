import React from "react";
import { Options } from "@tile-generator/common";
import { changeOptions } from "../../redux/modules/settings";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import InputRow from "./InputRow";
import SelectMenu from "./SelectMenu";
import styles from "./styles.module.css";

const widthParams = { min: 10, max: 120 };

interface OptionsProps {
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
};

export const OptionsComponent: React.FC<OptionsProps> = ({
  onChange,
  selectedOptions,
}) => {
  return (
    <>
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
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsComponent);
