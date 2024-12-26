import { FC, ReactNode } from "react";
import styles from "./FAB.module.css";

type Props = {
  icon: ReactNode;
  onClick: () => void;
};

const FAB: FC<Props> = (props) => {
  return (
    <button className={styles.container} onClick={props.onClick}>
      {props.icon}
    </button>
  );
};

export { FAB };
