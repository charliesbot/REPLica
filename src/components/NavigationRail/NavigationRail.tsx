import { FC, ReactNode } from "react";
import styles from "./NavigationRail.module.css";

type Props = {
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
};

interface NavigationRailComponent extends FC<Props> {
  Item: FC<ItemProps>;
}

const NavigationRail: NavigationRailComponent = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>{props.top}</div>
      <div className={styles.center}>{props.center}</div>
      <div className={styles.bottom}>{props.bottom}</div>
    </div>
  );
};

type ItemProps = {
  icon: ReactNode;
  onClick: () => void;
};

NavigationRail.Item = (props: ItemProps) => {
  return (
    <button className={styles.item} onClick={props.onClick}>
      {props.icon}
    </button>
  );
};

export { NavigationRail };
