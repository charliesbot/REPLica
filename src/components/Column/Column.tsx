import { FC, ReactNode } from "react";
import styles from "./Column.module.css";

type Props = {
  children: ReactNode;
  gap?: number;
};

const Column: FC<Props> = (props) => {
  const { children, gap } = props;

  return (
    <div className={styles.container} style={{ gap }}>
      {children}
    </div>
  );
};

export { Column };
