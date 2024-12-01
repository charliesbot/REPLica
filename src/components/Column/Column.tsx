import { FC, ReactNode } from "react";
import styles from "./Column.module.css";

type Props = {
  children: ReactNode;
};

const Column: FC<Props> = (props) => {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
};

export { Column };
