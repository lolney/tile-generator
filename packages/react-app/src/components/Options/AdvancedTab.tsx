import React from "react";
import { Options, LayerWeights } from "@tile-generator/common";
import AdvancedSlider from "./AdvancedSlider";

interface AdvancedTabProps {
  layer: keyof LayerWeights;
  layerWeights: LayerWeights;
  onChange: (options: Partial<Options>) => void;
}

const InputRow: React.FC<AdvancedTabProps> = ({
  layer,
  layerWeights,
  onChange,
}) => {
  const props = {
    value: (layerWeights[layer] === undefined
      ? 0.5
      : layerWeights[layer]) as number,
    min: 0,
    max: 1,
    onChange: (value: number) =>
      onChange({
        layerWeights: { ...layerWeights, [layer]: value },
      }),
  };
  return <AdvancedSlider {...props}></AdvancedSlider>;
};

export default InputRow;
