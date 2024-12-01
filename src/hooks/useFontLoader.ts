import { useEffect, useMemo } from "react";
import { useMonaco } from "@monaco-editor/react";
import { fonts } from "../configs/fontOptions";
import { useLocalState } from "../context/LocalState";

export const useFontLoader = () => {
  const { settings } = useLocalState();
  const monaco = useMonaco();
  const font = fonts[settings.font];

  useEffect(() => {
    const linkId = `font-${settings.font}`;
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = font.url;
      document.head.appendChild(link);
    }

    monaco?.editor.remeasureFonts();
  }, [settings.font]);

  const fontFamily = useMemo(() => `'${font.fontFamily}', monospace`, [settings.font]);

  return fontFamily;
};
