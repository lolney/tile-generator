import React from "react";
import { BaseWeb } from "../../context/baseweb";
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
              className={styles.link}
            >
              <Button>Github</Button>
            </a>
          </div>
        </div>
        <video controls>
          <source src="/about-video.mp4" type="video/mp4"></source>
        </video>
        <div className={styles.showcase_container}>
          <div className={styles.showcase_row}>
            <img
              className={styles.showcase_image_1}
              src="/show1.png"
              alt="climate chile"
            ></img>
            <div className={styles.showcase_text_container}>
              <h1 className={styles.showcase_text}>
                Generate maps from anywhere in the world, at nearly any level of
                detail
              </h1>
            </div>
          </div>
          <div className={styles.showcase_row}>
            <div className={styles.showcase_text_container}>
              <h1 className={styles.showcase_text}>
                Toggle through different layers to preview geographic features{" "}
              </h1>
            </div>
            <img
              className={styles.showcase_image_2}
              src="/show2.png"
              alt="zoomed climate chile"
            ></img>
          </div>
        </div>

        <p className={styles.landing_subtitle}>
          If you'd like to help keep the servers running, feel free to donate by
          clicking the button below:
        </p>
        <a
          href="https://www.buymeacoffee.com/tilegenerator"
          className={styles.link}
        >
          <img
            className={styles.donate_button}
            src="/bmc-button.png"
            alt="donate"
          ></img>
        </a>
      </div>
      <div className={styles.bottom_bar}>
        <div className={styles.outro}>
          <h1 className={styles.lower_landing_header}>Attribution</h1>
          <p className={styles.attribution_header}>Climate data</p>
          <p className={styles.paragraph}>
            Beck, H., Zimmermann, N., McVicar, T. et al. Present and future
            Köppen-Geiger climate classification maps at 1-km resolution. Sci
            Data 5, 180214 (2018). https://doi.org/10.1038/sdata.2018.214
          </p>
          <p className={styles.attribution_header}>
            Water (lake, coast, ocean) data
          </p>
          <p className={styles.paragraph}>
            Carroll, M.L., DiMiceli, C.M., Wooten, M.R., Hubbard, A.B.,
            Sohlberg, R.A., Townshend, J.R.G (2017). MOD44W MODIS/Terra Land
            Water Mask Derived from MODIS and SRTM L3 Global 250m SIN Grid V006
            [Data set]. NASA EOSDIS Land Processes DAAC. Accessed 2020-05-11
            from https://doi.org/10.5067/MODIS/MOD44W.006
          </p>
          <p className={styles.attribution_header}>Marsh/wetlands data</p>
          <p className={styles.paragraph}>
            Friedl, M., Sulla-Menashe, D. (2019). MCD12Q1 MODIS/Terra+Aqua Land
            Cover Type Yearly L3 Global 500m SIN Grid V006 [Data set]. NASA
            EOSDIS Land Processes DAAC. Accessed 2020-05-11 from
            https://doi.org/10.5067/MODIS/MCD12Q1.006
          </p>
          <p className={styles.attribution_header}>Elevation data</p>
          <p className={styles.paragraph}>
            Jarvis, A., H.I. Reuter, A. Nelson, E. Guevara. 2008. Hole-filled
            SRTM for the globe Version 4, available from the CGIAR-CSI SRTM 90m
            Database: http://srtm.csi.cgiar.org.
          </p>
          <p className={styles.attribution_header}>River data</p>
          <p className={styles.paragraph}>
            Lehner, B., Verdin, K., Jarvis, A. (2008): New global hydrography
            derived from spaceborne elevation data. Eos, Transactions, AGU,
            89(10): 93-94.
          </p>
          <p className={styles.attribution_header}>Forest data</p>
          <p className={styles.paragraph}>
            Masanobu Shimada, Takuya Itoh, Takeshi Motooka, Manabu Watanabe,
            Shiraishi Tomohiro, Rajesh Thapa, and Richard Lucas, "New Global
            Forest/Non-forest Maps from ALOS PALSAR Data (2007-2010)", Remote
            Sensing of Environment, 155, pp. 13-31, December 2014.
            doi:10.1016/j.rse.2014.04.014.
          </p>
        </div>
      </div>
    </div>
  </BaseWeb>
);
