import React from "react";
import { ProgressBar } from "baseui/progress-bar";
import styles from "./styles.module.css";
import ControlButtons from "../ControlButtons";

export const LoadingToggler: React.FC = () => (
  <>
    <div className={styles.header}>BUILDING MAP...</div>
    <div className={styles.component_array}>
      <button className={styles.component_btn}>Climate</button>
      <button className={styles.component_btn}>Land</button>
      <button className={styles.component_btn}>Elevation</button>
      <button className={styles.component_btn}>Forest</button>
      <button className={styles.component_btn}>Rivers</button>
      <button className={styles.component_btn}>Marsh</button>
    </div>
    <ProgressBar
      value={23}
      successValue={100}
      overrides={{
        BarProgress: {
          style: () => {
            return {
              position: "relative",
              backgroundcolor: "#4d90e6"
            };
          }
        },
        Bar: {
          style: ({ $theme }) => ({
            height: $theme.sizing.scale300,
            marginLeft: "30px",
            marginRight: "30px",
            backgroundColor: "#363636"
          })
        }
      }}
    />
    <ControlButtons textPrimary={"Download"} textSecondary={"Reset"} />
  </>
);

export default LoadingToggler;
