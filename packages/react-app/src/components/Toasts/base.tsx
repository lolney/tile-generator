/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import { Button, SIZE } from "baseui/button";
import { Block } from "baseui/block";
import { errorCodes } from "@tile-generator/common";
import styles from "./styles.module.css";

interface ToastProps {
  close: () => void;
  error: keyof typeof errorCodes;
}

interface InfoProps {
  close: () => void;
  error: keyof typeof errorCodes;
}

export const Info: React.FC<InfoProps> = ({ close, error }) => {
  let helpPath;
  switch (error) {
    case 0:
      helpPath = "/help#errorQuestion";
      break;
    case 10:
    case 11:
      helpPath = "/help#quotaQuestion";
  }
  return (
    <Block marginTop="15px" display="flex" justifyContent="center">
      <a href={helpPath} target="_blank" style={{ textDecoration: "none" }}>
        <Button
          onClick={close}
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
};

export const Toast: React.FC<ToastProps> = ({ close, error }) => (
  <>
    <header className={styles.header}>
      ERROR: <div className={styles.body}>{errorCodes[error]}</div>
    </header>
    <Info close={close} error={error} />
  </>
);
