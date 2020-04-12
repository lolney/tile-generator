import React from "react";
import styles from "./styles.module.css";
import Options from "../../v2-components/Options";
import LoadingToggler from "../../v2-components/LoadingToggler";

export const Dock: React.FC = () => (
  <>
    <div className={styles.container}>
      <LoadingToggler />
    </div>
  </>
);

export default Dock;
