import React from "react";
import { LayerWeights, Options } from "@tile-generator/common";
import { changeOptions, resetOptions } from "../../redux/modules/settings";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import styles from "./styles.module.css";
import { StatefulTabs, Tab } from "baseui/tabs";
import * as colors from "../../constants/colors";
import AdvancedTab from "./AdvancedTab";

interface OptionsProps {
  layerWeights: LayerWeights;
  onChange: (options: Partial<Options>) => void;
}

const mapStateToProps = (state: State) => ({
  layerWeights: state.settings.layerWeights || {},
});

const mapDispatchToProps = {
  onChange: changeOptions,
};

const tabStyle = ({ $active, $disabled, $theme }: any) => ({
  outlineColor: colors.textColorWhite,
  borderBottomColor: "#4d90e6",
  color: $active ? colors.textColorWhite : "#d6d6d6",
  paddingBottom: "2px",
  fontSize: "12px",
  fontWeight: 600,
  paddingTop: "9px", // tentative
  ":hover": $disabled
    ? {}
    : {
        color: colors.textColorWhite,
      },
  ":focus": $disabled
    ? {}
    : {
        color: colors.textColorWhite,
      },
});

const layers: Array<{ layer: keyof LayerWeights; title: string }> = [
  { title: "Water", layer: "water" },
  { title: "Mountains", layer: "elevation" },
  { title: "Forest", layer: "forest" },
  { title: "Rivers", layer: "rivers" },
  { title: "Marsh", layer: "marsh" },
];

export const OptionsComponent: React.FC<OptionsProps> = ({
  onChange,
  layerWeights,
}) => {
  return (
    <>
      <div className={styles.advanced_body}>
        <StatefulTabs
          initialState={{ activeKey: "water" }}
          overrides={{
            Root: {
              style: () => ({
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: "var(--textfieldGrey)",
              }),
            },
            TabBar: {
              style: () => ({
                backgroundColor: "var(--textfieldGrey)",
                justifyContent: "center",
                height: "35px", // tentative
              }),
            },
            TabContent: {
              style: () => ({
                fontSize: "13px",
                padding: "0px",
                color: "var(--textColorWhite)",
              }),
            },
          }}
        >
          {layers.map(({ title, layer }) => (
            <Tab
              title={title}
              overrides={{
                Tab: { style: tabStyle },
              }}
              key={layer}
            >
              <AdvancedTab
                layer={layer}
                layerWeights={layerWeights}
                onChange={onChange}
              />
            </Tab>
          ))}
        </StatefulTabs>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsComponent);
