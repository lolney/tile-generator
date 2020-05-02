import React, { useEffect } from "react";
import { toaster, ToasterContainer, PLACEMENT } from "baseui/toast";
import { Button, SIZE } from "baseui/button";
import { Block } from "baseui/block";
import styles from "./styles.module.css";

export const ToastError: React.FC = () => {
  useEffect(() => {
    const msg = (
      <header className={styles.header}>
        ERROR:{" "}
        <div className={styles.body}>
          Not enough land tiles. Map will fail to load in-game.
        </div>
      </header>
    );
    const info = (
      <Block marginTop="15px" display="flex" justifyContent="center">
        <a
          href="/help#errorQuestion"
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Button
            onClick={() => toaster.clear(toastID)}
            size={SIZE.compact}
            overrides={{
              BaseButton: {
                style: {
                  borderRadius: "10.5px",
                },
              },
            }}
          >
            More info
          </Button>
        </a>
      </Block>
    );

    const toastID = toaster.negative(
      <>
        {msg}
        {info}
      </>,
      {
        onClose: () => console.log("Toast closed."),
        overrides: {
          InnerContainer: {
            style: { width: "100%" },
          },
        },
      }
    );
  }, []);
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
    ></ToasterContainer>
  );
};

export default ToastError;
