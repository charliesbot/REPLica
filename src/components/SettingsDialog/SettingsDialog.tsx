import { FC, RefObject } from "react";
import { Checkbox } from "../Checkbox";
import { Spacer } from "../Spacer";
import { EditorFont, fontOptions } from "../../configs/fontOptions";
import { EditorTheme, themeOptions } from "../../configs/themeOptions";
import { IoCloseOutline } from "react-icons/io5";
import { useLocalState } from "../../context/LocalState";
import { Dropdown } from "../Dropdown";
import { Label } from "../Label";
import { Column } from "../Column";
import styles from "./SettingsDialog.module.css";

type Props = {
  dialogRef: RefObject<HTMLDialogElement>;
};

const SettingsDialog: FC<Props> = (props) => {
  const { dialogRef } = props;
  const { settings, updateSetting } = useLocalState();

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <IoCloseOutline
          size={24}
          style={{ cursor: "pointer" }}
          onClick={() => dialogRef.current?.close()}
        />
      </div>
      <Spacer size={32} />
      <Checkbox
        id="vimMode"
        label="Enable Vim Mode"
        isChecked={settings.vimMode}
        onClick={(value: boolean) => updateSetting("vimMode", value)}
      />
      <Spacer size={24} />
      <Column>
        <Label htmlFor="theme">Theme</Label>
        <Spacer size={10} />
        <Dropdown
          id="theme"
          options={themeOptions}
          onChange={(event) => {
            updateSetting("theme", event.target.value as EditorTheme);
          }}
          value={settings.theme}
        />
      </Column>
      <Spacer size={24} />
      <Column>
        <Label htmlFor="font">Font</Label>
        <Spacer size={10} />
        <Dropdown
          id="font"
          options={fontOptions}
          onChange={(event) => {
            updateSetting("font", event.target.value as EditorFont);
          }}
          value={settings.font}
        />
      </Column>
    </dialog>
  );
};

export { SettingsDialog };
