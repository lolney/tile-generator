import React from "react";
import styles from "./styles.module.css";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { primary?: boolean; children?: React.ReactNode };

const Button: React.FC<ButtonProps> = ({ primary, children, ...props }) => (
  <button
    className={primary ? styles.primary_button : styles.button}
    {...props}
  >
    {children}
  </button>
);

export default Button;
