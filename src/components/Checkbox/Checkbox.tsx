import { FC } from "react";
import styles from "./Checkbox.module.css";

type Props = {
  id: string;
  label: string;
  isChecked: boolean;
  onClick: (value: boolean) => void;
};

const Checkbox: FC<Props> = (props) => {
  const { id, label, isChecked, onClick } = props;
  console.log("TEST ", isChecked);

  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        name={id}
        checked={isChecked}
        onChange={(e) => onClick(e.currentTarget.checked)}
        className={styles.input}
      />
      {label}
    </label>
  );
};

export { Checkbox };
