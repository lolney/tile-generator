import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BaseQuotaCounter } from "./base";
import { State, ToolbarState } from "../../redux/types";
import { fetchGlobalLimits, fetchIpLimits } from "../../redux/modules/toolbar";

const mapStateToProps = ({
  toolbar: { ipCount, ipTotal, globalCount, globalTotal },
}: State) => ({
  ipCount,
  ipTotal,
  globalCount,
  globalTotal,
});

const mapDispatchToProps = {
  fetchGlobalLimits,
  fetchIpLimits,
};

type QuotaCounterProps = ToolbarState & {
  fetchGlobalLimits: () => void;
  fetchIpLimits: () => void;
};

const QuotaCounter: React.FC<QuotaCounterProps> = ({
  ipCount,
  ipTotal,
  globalCount,
  globalTotal,
  fetchGlobalLimits,
  fetchIpLimits,
}) => {
  useEffect(() => {
    fetchGlobalLimits();
    fetchIpLimits();
  }, []);

  const baseProps = {
    ipCount,
    ipTotal,
    globalCount,
    globalTotal,
  };

  return <BaseQuotaCounter {...baseProps} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(QuotaCounter);
