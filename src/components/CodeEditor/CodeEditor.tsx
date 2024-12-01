import { FC, useCallback, useRef, useState } from "react";
import { OnChange, EditorProps, OnMount } from "@monaco-editor/react";
import { EditorType, EditorLanguage } from "../../types/codeEditorTypes";
import { EditorTheme } from "../../configs/themeOptions";
import styles from "./CodeEditor.module.css";
import { useLocalState } from "../../context/LocalState";
import { useVim } from "../../hooks/useVim";
import { WrappedCodeEditor } from "../WrappedCodeEditor";

type Options = EditorProps["options"];

interface MonacoEditorProps {
  code?: string;
  onChange?: (value: string | undefined) => void;
  language: EditorLanguage;
  theme: EditorTheme;
  options?: Options;
}

const baseOptions: Options = {
  scrollBeyondLastLine: false,
  minimap: { enabled: false },
  glyphMargin: false,
  inlayHints: { enabled: "off" },
  lineNumbers: "off",
  fontSize: 14,
  scrollbar: {
    vertical: "auto",
  },
  padding: {
    top: 20,
    bottom: 20,
  },
  automaticLayout: true,
};

const CodeEditor: FC<MonacoEditorProps> = (props) => {
  const { code, onChange, language, theme, options = {} } = props;
  const { settings } = useLocalState();
  const [editor, setEditor] = useState<EditorType | null>(null);
  const vimStatusLineRef = useRef<HTMLDivElement>(null);

  useVim(editor, vimStatusLineRef);

  const handleOnMount: OnMount = useCallback((editorInstance: EditorType) => {
    setEditor(editorInstance);
  }, []);

  const handleEditorChange: OnChange = useCallback(
    (value) => {
      onChange?.(value);
    },
    [onChange],
  );

  return (
    <div className={styles.container}>
      <WrappedCodeEditor
        onMount={handleOnMount}
        height="100%"
        code={code}
        language={language}
        onChange={handleEditorChange}
        theme={theme}
        options={{ ...baseOptions, ...options }}
      />
      {settings.vimMode && <div ref={vimStatusLineRef} className={styles.vimStatusLine} />}
    </div>
  );
};

export { CodeEditor };
