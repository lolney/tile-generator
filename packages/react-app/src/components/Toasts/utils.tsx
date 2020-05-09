import React from "react";
import { toaster } from "baseui/toast";
import { errorCodes } from "@tile-generator/common";
import { Toast } from "./base";

export const createToast = (
  error: keyof typeof errorCodes,
  onClose: () => void
) => {
  const close = () => {
    onClose();
    toaster.clear(toastId);
  };

  var toastId = toaster.negative(React.createElement(Toast, { close, error }), {
    onClose: () => console.log("Toast closed."),
    overrides: {
      InnerContainer: {
        style: { width: "100%" },
      },
    },
  });

  return close;
};
