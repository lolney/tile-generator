import React from "react";
import { Slider } from "baseui/slider";
import * as colors from "../../constants/colors";
import { useStyletron } from "baseui";
import styles from "./styles.module.css";
import { layerWeightDefaults } from "@tile-generator/common";
import { LayerWeights } from "@tile-generator/common";
import AnimatedThumb from "../AnimatedThumb";

interface TileSliderProps {
  layer: keyof LayerWeights;
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
}

const Thumb: React.FC = () => <AnimatedThumb />;

const AdvancedSlider: React.FC<TileSliderProps> = ({
  layer,
  value,
  onChange,
  ...rest
}) => {
  const [css, theme] = useStyletron();
  const defaultValue = layerWeightDefaults[layer];

  return (
    <div className={styles.slider_container}>
      <div
        className={css({
          backgroundColor: "none",
          border: "3px dashed",
          borderColor: "#ccc",
          borderRadius: "1px",
          bottom: "-8px",
          height: "18px",
          left: `calc(${defaultValue * 100}% - 11px)`,
          opacity: "15%",
          pointerEvents: "none",
          position: "absolute",
          width: "16px",
          zIndex: 1,
        })}
      ></div>

      <Slider
        value={[value]}
        step={0.01}
        onChange={(e) => onChange(e.value[0])}
        {...rest}
        overrides={{
          Root: {
            style: () => ({
              width: "100%",
              height: "16px",
            }),
          },
          Track: {
            style: () => ({
              paddingRight: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              paddingTop: 0,
            }),
          },
          TickBar: ({ $min, $max }) => (
            <div
              className={css({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: theme.sizing.scale400,
              })}
            >
              <div className={styles.caption_container}>
                <div className={styles.marker_none}></div>
                <div className={styles.caption}>None</div>
              </div>
              <div className={styles.caption_container}>
                <div className={styles.marker}></div>
                <div className={styles.caption}>Light</div>
              </div>
              <div className={styles.caption_container}>
                <div className={styles.marker}></div>
                <div className={styles.caption}>Medium</div>
              </div>
              <div className={styles.caption_container}>
                <div className={styles.marker}></div>
                <div className={styles.caption}>Heavy</div>
              </div>
              <div className={styles.caption_container}>
                <div className={styles.marker_ubiquitous}></div>
                <div className={styles.caption}>Max</div>
              </div>
            </div>
          ),
          InnerThumb: () => null,
          ThumbValue: () => null,
          InnerTrack: {
            style: () => ({
              background: colors.textFieldGrey,
              height: "24px",
            }),
          },
          Thumb,
        }}
      />
    </div>
  );
};

export default AdvancedSlider;
