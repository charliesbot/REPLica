import { useEffect } from "react";
import { useMonaco } from "@monaco-editor/react";
import { fonts } from "../configs/fontOptions";
import { useLocalState } from "../context/LocalState";

export const useFontLoader = () => {
  const { settings } = useLocalState();
  const monaco = useMonaco();
  const font = fonts[settings.font];

  useEffect(() => {
    monaco?.editor.remeasureFonts();
  }, [settings.font]);

  return font.fontFamily;
};
