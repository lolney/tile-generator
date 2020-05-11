import React from "react";
import styles from "./styles.module.css";
import Modal from "../../components/Modal";

const QuotaModal = () => (
  <Modal onClose={() => {}} header={"Map Limit Reached!"}>
    <h1 className={styles.subheader}>
      Unfortunately, the site has reached its limit for today.
    </h1>
    <div className={styles.text_container}>
      <p className={styles.text_body}>
        You have either generated your daily quota of 10 maps, or the site has
        collectively generated its daily quota of 500 maps for all users.
      </p>
      <p className={styles.text_body}>
        Please come back again tomorrow if you'd like to generate more maps. In
        the meantime, feel free to play around with the map options tool and the
        grid overlay. Apologies for the inconvenience.
      </p>
    </div>
  </Modal>
);

export default QuotaModal;
