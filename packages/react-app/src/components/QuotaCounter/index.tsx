import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BaseQuotaCounter } from "./base";
import { State, ToolbarState } from "../../redux/types";
import {
  fetchGlobalLimits,
  fetchIpLimits,
  setGlobalRequestsCount,
} from "../../redux/modules/toolbar";
import { BACKEND_URL } from "../../constants/values";

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
  setGlobalRequestsCount,
};

type QuotaCounterProps = ToolbarState & {
  fetchGlobalLimits: () => void;
  fetchIpLimits: () => void;
  setGlobalRequestsCount: (count: number) => void;
};

const createEventSource = (event: string, callback: (e: Event) => any) => {
  let eventSource = new EventSource(event);
  eventSource.addEventListener("count", callback);
  return () => {
    eventSource.removeEventListener("count", callback);
  };
};

const QuotaCounter: React.FC<QuotaCounterProps> = ({
  ipCount,
  ipTotal,
  globalCount,
  globalTotal,
  fetchGlobalLimits,
  fetchIpLimits,
  setGlobalRequestsCount,
}) => {
  useEffect(() => {
    fetchGlobalLimits();
    fetchIpLimits();
  }, [fetchGlobalLimits, fetchIpLimits]);

  useEffect(
    () =>
      createEventSource(`${BACKEND_URL}/maps-generated`, (e: Event) => {
        const data = JSON.parse((e as any).data);
        setGlobalRequestsCount(data.count);
      }),
    [setGlobalRequestsCount]
  );

  const baseProps = {
    ipCount,
    ipTotal,
    globalCount,
    globalTotal,
  };

  return <BaseQuotaCounter {...baseProps} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(QuotaCounter);
