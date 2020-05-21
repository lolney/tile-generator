import React from "react";
import { StatefulTooltip } from "baseui/tooltip";
import { DarkTheme, ThemeProvider } from "baseui";
import { State, ToolbarState } from "../../redux/types";
import styles from "./styles.module.css";

const quotaTooltip = () => (
  <ThemeProvider theme={DarkTheme}>
    Daily map quota.{` `}
    <a className={styles.help_link} href="/help#quotaQuestion" target="_blank">
      Learn More
    </a>
  </ThemeProvider>
);

export const BaseQuotaCounter: React.FC<ToolbarState> = ({
  ipCount,
  ipTotal,
  globalCount,
  globalTotal,
}) => (
  <div className={styles.outer_container}>
    <StatefulTooltip accessibilityType={"tooltip"} content={quotaTooltip}>
      <div>
        <div className={styles.inner_container}>
          <p className={styles.text_front}>Maps you’ve generated today :</p>
          <p className={styles.text}>
            <b>
              {ipCount} / {ipTotal}
            </b>
          </p>
        </div>
        <div className={styles.inner_container}>
          <p className={styles.text_front}>Total maps generated today :</p>
          <p className={styles.text}>
            <b>
              {globalCount} / {globalTotal}
            </b>
          </p>
        </div>
      </div>
    </StatefulTooltip>
  </div>
);
