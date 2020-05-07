import React from "react";
import { Button, SIZE } from "baseui/button";
import { Block } from "baseui/block";
import styles from "./styles.module.css";

interface ToastProps {
  close: () => void;
}

export const msg = (
  <header className={styles.header}>
    ERROR:{" "}
    <div className={styles.body}>
      Not enough land tiles. Map will fail to load in-game.
    </div>
  </header>
);

export const Info: React.FC<ToastProps> = ({ close }) => (
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

export const Toast: React.FC<ToastProps> = ({ close }) => (
  <>
    {msg}
    <Info close={close} />
  </>
);
