import React from "react";
import { Options } from "@tile-generator/common";
import { submit } from "../../redux/modules/map";
import { changeOptions, resetOptions } from "../../redux/modules/settings";
import { LightTheme, ThemeProvider } from "baseui";
import { StatefulTooltip } from "baseui/tooltip";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import InputRow from "./InputRow";
import SelectMenu from "./SelectMenu";
import { ControlButtons } from "../ControlButtons";
import styles from "./styles.module.css";
import Button from "../Button";
import { reachedLimit } from "../../redux/modules/toolbar";

const widthParams = { min: 10, max: 120 };

interface OptionsProps {
  onSubmit: () => void;
  selectedOptions: Options;
  limitReached: boolean;
  onChange: (options: Options) => void;
  resetOptions: () => void;
}

const mapStateToProps = (state: State) => ({
  selectedOptions: {
    format: state.settings.format,
    dimensions: state.settings.dimensions,
  },
  limitReached: reachedLimit(state),
});

const mapDispatchToProps = {
  onChange: changeOptions,
  onSubmit: submit,
  resetOptions,
};

const quotaTooltip = () => (
  <ThemeProvider theme={LightTheme}>
    Youv'e reached your daily map quota.{` `}
    <a className={styles.help_link} href="/help#quotaQuestion" target="_blank">
      Learn More
    </a>
  </ThemeProvider>
);

export const OptionsComponent: React.FC<OptionsProps> = ({
  limitReached,
  onChange,
  onSubmit,
  selectedOptions,
  resetOptions,
}) => {
  return (
    <>
      <div className={styles.header}>MAP OPTIONS</div>
      {(["width", "height"] as Array<"width" | "height">).map((title) => (
        <InputRow
          selectedOptions={selectedOptions}
          onChange={onChange}
          title={title}
          field={title}
          key={title}
          {...widthParams}
        />
      ))}
      <div className={styles.horizontal_containers}>
        <div className={styles.left_header_container}>
          <div className={styles.left_headers}>Format</div>
        </div>
        <SelectMenu />
      </div>
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
            <Button primary disabled={limitReached} onClick={onSubmit}>
              Generate
            </Button>
          </div>
        )}
        <Button onClick={resetOptions}>Reset</Button>
      </ControlButtons>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsComponent);
