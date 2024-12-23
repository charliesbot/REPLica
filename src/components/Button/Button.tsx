import { FC, ReactNode } from "react";
import styles from "./Button.module.css";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "filled" | "tonal" | "outlined" | "elevated" | "text";
};

const Button: FC<Props> = (props) => {
  const { children, variant = "filled" } = props;
  return <button className={`${styles.button} ${styles[variant]}`}>{children}</button>;
};

export { Button };
