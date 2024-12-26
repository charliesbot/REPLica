import { FC, useCallback, useRef, useState } from "react";
import { OnChange, EditorProps, OnMount } from "@monaco-editor/react";
import { EditorType, EditorLanguage } from "../../types/codeEditorTypes";
import { EditorTheme } from "../../configs/themeOptions";
import { useVim } from "../../hooks/useVim";
import { WrappedCodeEditor } from "../WrappedCodeEditor";
import { VimStatusLine } from "../VimStatusLine";
import styles from "./CodeEditor.module.css";

type Options = EditorProps["options"];

interface MonacoEditorProps {
  code?: string;
  onChange?: (value: string | undefined) => void;
  language: EditorLanguage;
  theme: EditorTheme;
  options?: Options;
}

const CodeEditor: FC<MonacoEditorProps> = (props) => {
  const { code, onChange, language, theme, options = {} } = props;
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
        options={options}
      />
      <VimStatusLine ref={vimStatusLineRef} />
    </div>
  );
};

export { CodeEditor };
