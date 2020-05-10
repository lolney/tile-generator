import React from "react";
import Button from "../../components/Button";
import styles from "./styles.module.css";

interface ModalProps {
  onClose: () => void;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, header, children }) => (
  <>
    <div className={styles.screen}>
      <div className={styles.window}>
        <header className={styles.header}>{header}</header>
        {children}
        <div className={styles.buttonContainer}>
          <Button primary onClick={onClose}>
            Ok
          </Button>
        </div>
      </div>
    </div>
  </>
);

export default Modal;
