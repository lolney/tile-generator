import React from "react";
import { BaseWeb } from "../../baseweb";
import { NavLink } from "react-router-dom";
import Button from "../../components/Button";
import styles from "./styles.module.css";

export const About: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.body}>
        <div className={styles.intro}>
          <h1 className={styles.landing_header}>
            Real-world map builder for Civilization
          </h1>
          <p className={styles.landing_subtitle}>
            Generate maps for Civilization V and VI using satellite data
          </p>
          <div className={styles.btn_container}>
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "var(--backgroundGrey)" }}
            >
              <Button primary>Get started</Button>
            </NavLink>
            <a
              href="https://github.com/lolney/tile-generator"
              style={{ textDecoration: "none", color: "var(--backgroundGrey)" }}
            >
              <Button>Github</Button>
            </a>
          </div>
        </div>
        <video controls>
          <source src="/about-video.mp4" type="video/mp4"></source>
        </video>
        <p className={styles.landing_subtitle}>
          If you'd like to help keep the servers running, feel free to donate by
          clicking the button below:
        </p>
        <a
          href="https://www.buymeacoffee.com/tilegenerator"
          style={{ textDecoration: "none", color: "var(--backgroundGrey)" }}
        >
          <img
            className={styles.donate_button}
            src="/bmc-button.png"
            alt="donate"
          ></img>
        </a>
      </div>
    </div>
  </BaseWeb>
);
