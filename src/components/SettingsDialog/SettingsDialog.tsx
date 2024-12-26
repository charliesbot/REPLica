import { FC, useEffect, useRef } from "react";
import { EditorFont, fontOptions } from "../../configs/fontOptions";
import { EditorTheme, themeOptions } from "../../configs/themeOptions";
import { useLocalState } from "../../context/LocalState";
import { Checkbox } from "../Checkbox";
import { Dropdown } from "../Dropdown";
import { Label } from "../Label";
import { Column } from "../Column";
import { Button } from "../Button";
import styles from "./SettingsDialog.module.css";
import { Input } from "../Input";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsDialog: FC<Props> = (props) => {
  const { settings, updateSetting } = useLocalState();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (props.isOpen) {
      if (!dialog?.open) {
        dialog?.showModal();
      }
    } else {
      if (dialog?.open) {
        dialog?.close();
      }
    }
  }, [props.isOpen]);

  if (!props.isOpen) {
    return null;
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </div>
      <Column gap={10}>
        <Label htmlFor="theme">Theme</Label>
        <Dropdown
          id="theme"
          options={themeOptions}
          onChange={(event) => {
            updateSetting("theme", event.target.value as EditorTheme);
          }}
          value={settings.theme}
        />
      </Column>
      <Column gap={10}>
        <Label htmlFor="font">Font</Label>
        <Dropdown
          id="font"
          options={fontOptions}
          onChange={(event) => {
            updateSetting("font", event.target.value as EditorFont);
          }}
          value={settings.font}
        />
      </Column>
      <Column gap={10}>
        <Label htmlFor="fontSize">Font Size</Label>
        <Input
          id="fontSize"
          onChange={(event) => {
            updateSetting("fontSize", parseInt(event.target.value));
          }}
          value={settings.fontSize.toString()}
        />
      </Column>
      <Column gap={10}>
        <Label htmlFor="vimMode">Vim Mode</Label>
        <Checkbox
          id="vimMode"
          label="Enable Vim Mode"
          isChecked={settings.vimMode}
          onClick={(value: boolean) => updateSetting("vimMode", value)}
        />
      </Column>
      <div className={styles.footer}>
        {/* <Button variant="text">Cancel</Button> */}
        <Button variant="outlined" onClick={props.onClose}>
          Accept
        </Button>
      </div>
    </dialog>
  );
};

export { SettingsDialog };
