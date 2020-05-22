import React from "react";
import { Options } from "@tile-generator/common";
import TileSlider from "./TileSlider";
import TileInput from "./TileInput";
import styles from "./styles.module.css";

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
    onChange: (value: number) =>
      onChange({
        ...selectedOptions,
        dimensions: { ...selectedOptions.dimensions, [field]: value },
      }),
  };
  return (
    <div className={styles.horizontal_containers}>
      <div className={styles.left_header_container}>
        <div className={styles.left_headers}>{title}</div>
      </div>
      <TileSlider {...props} />
      <TileInput {...props} />
    </div>
  );
};

export default InputRow;
