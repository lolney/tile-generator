import React from "react";
import { Slider } from "baseui/slider";
import * as colors from "../../constants/colors";
import { useStyletron } from "baseui";
import styles from "./styles.module.css";

interface TileSliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  min: number;
}

const AdvancedSlider: React.FC<TileSliderProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const [css, theme] = useStyletron();

  return (
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
              <div className={styles.caption}>Scarce</div>
            </div>
            <div className={styles.caption_container}>
              <div className={styles.marker}></div>
              <div className={styles.caption}>Medium</div>
            </div>
            <div className={styles.caption_container}>
              <div className={styles.marker}></div>
              <div className={styles.caption}>Ample</div>
            </div>
            <div className={styles.caption_container}>
              <div className={styles.marker_ubiquitous}></div>
              <div className={styles.caption}>All-over</div>
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
        Thumb: () => (
          <div
            className={css({
              height: "18px",
              width: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderStyle: "solid",
              borderWidth: "3px",
              borderColor: "#ccc",
              zIndex: 1,
              position: "absolute",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
              backgroundColor: theme.colors.mono100,
              color: theme.colors.contentPrimary,
            })}
          ></div>
        ),
      }}
    />
  );
};

export default AdvancedSlider;
