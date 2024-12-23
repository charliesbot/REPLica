import { FC, ReactNode } from "react";
import styles from "./NavigationRail.module.css";

type Props = {
  top?: ReactNode;
};

interface NavigationRailComponent extends FC<Props> {
  Item: FC;
}

const NavigationRail: NavigationRailComponent = (props) => {
  return <div className={styles.container}>{props.top}</div>;
};

NavigationRail.Item = () => {
  return <div className={styles.item}>NavigationRail.Item</div>;
};

export { NavigationRail };
