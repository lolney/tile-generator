import React from "react";
import styles from "./styles.module.css";
import Modal from "../../components/Modal";

const QuotaCounter = () => (
  <div className={styles.outer_container}>
<<<<<<< Updated upstream
    <a
      href="/help#quotaQuestion"
      target="_blank"
      style={{ textDecoration: "none" }}
    >
=======
    <a className={styles.help_link} href="/help#quotaQuestion" target="_blank">
>>>>>>> Stashed changes
      <div className={styles.inner_container}>
        <p className={styles.text_front}>Maps you’ve generated today :</p>
        <p className={styles.text}>
          <b>3 / 10</b>
        </p>
      </div>
      <div className={styles.inner_container}>
        <p className={styles.text_front}>Total maps generated today :</p>
        <p className={styles.text}>
          <b>234 / 500</b>
        </p>
      </div>
<<<<<<< Updated upstream
      >
=======
>>>>>>> Stashed changes
    </a>
  </div>
);

export default QuotaCounter;
