import React from "react";
import styles from "./styles.module.css";

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { primary?: boolean; children?: React.ReactNode };

const Button = React.forwardRef(
  (
    { primary, children, ...props }: ButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) => (
    <button
      className={primary ? styles.primary_button : styles.button}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);

export default Button;
