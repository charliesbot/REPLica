import { MutableRefObject, useEffect, useRef } from "react";
import { EditorVimMode, initVimMode } from "monaco-vim";
import { useLocalState } from "../context/LocalState";
import { EditorType } from "../types/CodeEditorTypes";

export const useVim = (
  editor: EditorType | null,
  vimStatusLineRef: MutableRefObject<HTMLDivElement | null>,
) => {
  const vimModeRef = useRef<EditorVimMode | null>(null);
  const { settings } = useLocalState();

  useEffect(() => {
    const statusLine = vimStatusLineRef.current;

    if (!editor || !statusLine) {
      return;
    }

    const enableVimMode = () => {
      if (vimModeRef.current) {
        return;
      }

      vimModeRef.current = initVimMode(editor, statusLine);
      editor.updateOptions({ cursorStyle: "block" });

      vimModeRef.current.on("vim-mode-change", ({ mode }) => {
        editor.updateOptions({
          cursorStyle: mode === "insert" ? "line" : "block",
        });
      });
    };

    const disableVimMode = () => {
      if (!vimModeRef.current) {
        return;
      }

      vimModeRef.current.dispose();
      vimModeRef.current = null;
      editor.updateOptions({ cursorStyle: "line" });
    };

    if (settings.vimMode) {
      enableVimMode();
    } else {
      disableVimMode();
    }

    return () => {
      disableVimMode();
    };
  }, [settings.vimMode, vimStatusLineRef, editor]);
};
