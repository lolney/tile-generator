import React from "react";
import { Options } from "@tile-generator/common";
import { submit } from "../../redux/modules/map";
import { changeOptions, resetOptions } from "../../redux/modules/settings";
import { LightTheme, ThemeProvider } from "baseui";
import { StatefulTooltip } from "baseui/tooltip";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import { ControlButtons } from "../ControlButtons";
import styles from "./styles.module.css";
import Button from "../Button";
import { reachedLimit } from "../../redux/modules/toolbar";

interface OptionsProps {
  onSubmit: () => void;
  limitReached: boolean;
  resetOptions: () => void;
}

const mapStateToProps = (state: State) => ({
  limitReached: reachedLimit(state),
});

const mapDispatchToProps = {
  onSubmit: submit,
  resetOptions,
};

const quotaTooltip = () => (
  <ThemeProvider theme={LightTheme}>
    You've reached your daily map quota.{` `}
    <a className={styles.help_link} href="/help#quotaQuestion" target="_blank">
      Learn More
    </a>
  </ThemeProvider>
);

const SubmitButtons: React.FC<OptionsProps> = ({
  limitReached,
  onSubmit,
  resetOptions,
}) => (
  <ControlButtons>
    {limitReached ? (
      <StatefulTooltip
        accessibilityType={"tooltip"}
        content={quotaTooltip}
        overrides={{
          Inner: {
            style: ({ $theme }) => {
              return {
                color: "var(--backgroundGrey)",
                backgroundColor: "var(--textColorWhite)",
              };
            },
          },
        }}
      >
        <div>
          <Button primary disabled={limitReached} onClick={onSubmit}>
            Generate
          </Button>
        </div>
      </StatefulTooltip>
    ) : (
      <div>
        <Button primary onClick={onSubmit}>
          Generate
        </Button>
      </div>
    )}
    <Button onClick={resetOptions}>Reset</Button>
  </ControlButtons>
);

export default connect(mapStateToProps, mapDispatchToProps)(SubmitButtons);
