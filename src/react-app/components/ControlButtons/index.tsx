import React from "react";
import styles from "./styles.module.css";

interface ControlButtonsProps {
  children: React.ReactNode;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({ children }) => (
  <div className={styles.btn_container}>{children}</div>
);

export default ControlButtons;
