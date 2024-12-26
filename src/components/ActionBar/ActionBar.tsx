import { FC } from "react";
import { HiMiniPlay } from "react-icons/hi2";
import { LuHome, LuSettings } from "react-icons/lu";
import styles from "./ActionBar.module.css";

type Props = {
  onRun: () => void;
  onOpenSettings: () => void;
};

const ActionBar: FC<Props> = (props) => {
  const { onRun, onOpenSettings } = props;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button className={styles.baseButton}>
          <LuHome size={20} />
        </button>
        <button onClick={onRun} className={styles.gradientButton}>
          <HiMiniPlay size={20} />
        </button>
        <button onClick={onOpenSettings} className={styles.baseButton}>
          <LuSettings size={20} />
        </button>
      </div>
    </div>
  );
};

export { ActionBar };
