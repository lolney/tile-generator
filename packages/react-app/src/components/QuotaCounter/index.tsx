import React from "react";
import { StatefulTooltip } from "baseui/tooltip";
import { useStyletron, DarkTheme, ThemeProvider } from "baseui";
import styles from "./styles.module.css";

const quotaTooltip = () => (
  <ThemeProvider theme={DarkTheme}>
    Daily map quota.{` `}
    <a className={styles.help_link} href="/help#quotaQuestion" target="_blank">
      Learn More
    </a>
  </ThemeProvider>
);

const QuotaCounter = () => (
  <div className={styles.outer_container}>
    <StatefulTooltip accessibilityType={"tooltip"} content={quotaTooltip}>
      <div>
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
      </div>
    </StatefulTooltip>
  </div>
);

export default QuotaCounter;
