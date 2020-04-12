import React from "react";
import styles from "./styles.module.css";

interface ControlButtonsProps {
  textPrimary: string;
  textSecondary: string;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  textPrimary,
  textSecondary
}) => (
  <div className={styles.btn_container}>
    <button className={styles.primary_btm_button}>{textPrimary}</button>
    <button className={styles.btm_buttons}>{textSecondary}</button>
  </div>
);

export default ControlButtons;
