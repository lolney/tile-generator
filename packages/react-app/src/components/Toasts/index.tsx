import React, { useEffect } from "react";
import { toaster, ToasterContainer, PLACEMENT } from "baseui/toast";
import { Toast } from "./base";

const createToast = () => {
  const close = () => toaster.clear(toastID);

  var toastID = toaster.negative(<Toast close={close} />, {
    onClose: () => console.log("Toast closed."),
    overrides: {
      InnerContainer: {
        style: { width: "100%" },
      },
    },
  });

  return close;
};

const Toasts: React.FC = () => {
  useEffect(createToast, []);

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

export default Toasts;
