import React from "react";
import { Button, SIZE } from "baseui/button";
import { Block } from "baseui/block";
import styles from "./styles.module.css";
import { errorCodes } from "@tile-generator/common";

interface ToastProps {
  close: () => void;
  error: keyof typeof errorCodes;
}

interface InfoProps {
  close: () => void;
}

export const Info: React.FC<InfoProps> = ({ close }) => (
  <Block marginTop="15px" display="flex" justifyContent="center">
    <a
      href="/help#errorQuestion"
      target="_blank"
      style={{ textDecoration: "none" }}
    >
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

export const Toast: React.FC<ToastProps> = ({ close, error }) => (
  <>
    <header className={styles.header}>
      ERROR: <div className={styles.body}>{errorCodes[error]}</div>
    </header>
    <Info close={close} />
  </>
);
