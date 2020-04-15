import React from "react";
import styles from "./styles.module.css";

interface ControlButtonsProps {
  textPrimary: string;
  textSecondary: string;
  clickPrimary: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  textPrimary,
  textSecondary,
  clickPrimary,
}) => (
  <div className={styles.btn_container}>
    <button onClick={clickPrimary} className={styles.primary_btm_button}>
      {textPrimary}
    </button>
    <button className={styles.btm_buttons}>{textSecondary}</button>
  </div>
);

export default ControlButtons;
