import { FC } from "react";
import styles from "./Input.module.css";

type InputProps = {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const Input: FC<InputProps> = ({ id, value, onChange, placeholder }) => {
  return (
    <input
      className={styles.container}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export { Input };
