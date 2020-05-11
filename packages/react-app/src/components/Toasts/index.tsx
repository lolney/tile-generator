import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useSet } from "react-use";
import { ToasterContainer, PLACEMENT } from "baseui/toast";
import { errorCodes } from "@tile-generator/common";
import { createToast } from "./utils";
import { State } from "../../redux/types";
import { clearError } from "../../redux/modules/map";

interface ToastsProps {
  errors: Array<keyof typeof errorCodes>;
  clearError: (key: keyof typeof errorCodes) => void;
}

const mapStateToProps = (state: State) => ({
  errors: state.mapData.errorCodes,
});

const mapDispatchToProps = {
  clearError,
};

const Toasts: React.FC<ToastsProps> = ({ clearError, errors }) => {
  const [previousErrors, { remove, has, add, reset }] = useSet<
    keyof typeof errorCodes
  >(new Set());

  useEffect(() => {
    for (const error of errors) {
      if (!has(error)) {
        createToast(error, () => {
          clearError(error);
          remove(error);
        });
      }
    }
    reset();
    for (const elem of errors) add(elem);
  }, [errors, clearError, remove, has, add, reset]);

  return (
    <ToasterContainer
      placement={PLACEMENT.bottom}
      overrides={{
        ToastBody: {
          style: ({ $theme }) => ({
            backgroundColor: $theme.colors.toastNegativeBackground,
            boxShadow: "5px 5px 50px black",
            borderRadius: "5px",
          }),
        },
      }}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);
