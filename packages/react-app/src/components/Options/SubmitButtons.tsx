import React from "react";
import { submit } from "../../redux/modules/map";
import { resetOptions } from "../../redux/modules/settings";
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
            style: () => {
              return {
                color: "var(--backgroundGrey)",
                backgroundColor: "var(--textColorWhite)",
              };
            },
          },
        }}
      >
        <div>
          <Button primary disabled onClick={onSubmit}>
            Generate
          </Button>
        </div>
      </StatefulTooltip>
    ) : (
      <Button primary onClick={onSubmit}>
        Generate
      </Button>
    )}
    <Button onClick={resetOptions}>Clear Settings</Button>
  </ControlButtons>
);

export default connect(mapStateToProps, mapDispatchToProps)(SubmitButtons);
