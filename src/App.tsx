import { useEffect, useRef, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { resultsViewEditorConfig } from "./configs/resultsViewEditorConfig";
import { ActionBar } from "./components/ActionBar";
import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { EditorTheme } from "./configs/themeOptions";
import { WrappedCodeEditor } from "./components/WrappedCodeEditor";
import { tokyoNightTheme } from "./themes/tokyoNight";
import styles from "./App.module.css";

function App() {
  const [code, setCode] = useState<string | undefined>("");
  const [results, setResults] = useState<string | undefined>();
  const settingsDialogRef = useRef<HTMLDialogElement>(null);
  const handleRunRef = useRef<() => void>(() => {});
  const theme: EditorTheme = "tokyo-night";
  const language = "typescript";
  const monaco = useMonaco();
  // const { settings } = useLocalState();

  const handleRun = async () => {};

  const openSettings = () => {
    settingsDialogRef.current?.showModal();
  };

  useEffect(() => {
    // TODO - convert this into a theme hook
    if (monaco) {
      monaco.editor.defineTheme("tokyo-night", tokyoNightTheme);
      monaco.editor.setTheme("tokyo-night");
    }
  }, [monaco]);

  useEffect(() => {
    handleRunRef.current = handleRun;
  }, [handleRun]);

  return (
    <div className={styles.container}>
      <div className={styles.actionBarContainer}>
        <ActionBar onRun={handleRun} onOpenSettings={openSettings} />
      </div>
      <div className={styles.codeEditorContainer}>
        <CodeEditor code={code} onChange={setCode} theme={theme} language={language} />
      </div>
      <div className={styles.resultsViewContainer}>
        <WrappedCodeEditor
          code={results}
          theme={theme}
          language={language}
          options={resultsViewEditorConfig}
        />
      </div>
    </div>
  );
}

export default App;
