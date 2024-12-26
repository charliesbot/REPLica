import { FC, ReactNode } from "react";
import styles from "./Label.module.css";

type Props = {
  htmlFor: string;
  children: ReactNode;
};

const Label: FC<Props> = (props) => {
  const { children, htmlFor } = props;
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      {children}
    </label>
  );
};

export { Label };
