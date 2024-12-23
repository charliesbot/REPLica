import { forwardRef } from "react";
import styles from "./VimStatusLine.module.css";
import { useLocalState } from "../../context/LocalState";

type Props = {};

const VimStatusLine = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { settings } = useLocalState();
  if (!settings.vimMode) {
    return null;
  }

  return <div ref={ref} className={styles.container} />;
});

export { VimStatusLine };
