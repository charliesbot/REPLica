import { FC } from "react";
import { Editor, OnChange, EditorProps, OnMount } from "@monaco-editor/react";
import { EditorLanguage } from "../../types/codeEditorTypes";
import { EditorTheme } from "../../configs/themeOptions";
import { useFontLoader } from "../../hooks/useFontLoader";

type Options = EditorProps["options"];

interface MonacoEditorProps {
  code?: string;
  onChange?: OnChange;
  onMount?: OnMount;
  height?: string | number;
  language: EditorLanguage;
  theme: EditorTheme;
  options?: Options;
}

const baseOptions: Options = {
  fontLigatures: true,
  scrollBeyondLastLine: false,
  wrappingIndent: "indent",
  wordWrap: "on",
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

const WrappedCodeEditor: FC<MonacoEditorProps> = (props) => {
  const { code, onChange, language, theme, options = {}, onMount, height } = props;
  const fontFamily = useFontLoader();

  return (
    <Editor
      onMount={onMount}
      value={code}
      height={height ?? "100%"}
      width="100%"
      language={language}
      onChange={onChange}
      theme={theme}
      options={{
        ...baseOptions,
        ...options,
        fontFamily: fontFamily,
        fontSize: 16,
        domReadOnly: true,
      }}
    />
  );
};

export { WrappedCodeEditor };
