import { useEffect, useRef, useState } from "react";
import { KeyCode, KeyMod } from "monaco-editor";
import { useMonaco } from "@monaco-editor/react";
import { resultsViewEditorConfig } from "./configs/resultsViewEditorConfig";
import { LuSettings } from "react-icons/lu";
import { HiMiniPlay } from "react-icons/hi2";
import { CodeEditor } from "./components/CodeEditor/CodeEditor";
import { NavigationRail } from "./components/NavigationRail";
import { EditorTheme } from "./configs/themeOptions";
import { WrappedCodeEditor } from "./components/WrappedCodeEditor";
import { tokyoNightTheme } from "./themes/tokyoNight";
import { runJavascript } from "./runners/javascript";
import { useLocalState } from "./context/LocalState";
import { SettingsDialog } from "./components/SettingsDialog/SettingsDialog";
import styles from "./App.module.css";
import { FAB } from "./components/FAB";

function App() {
  const [code, setCode] = useState<string | undefined>("");
  const [results, setResults] = useState<string | undefined>();
  const handleRunRef = useRef<() => void>(() => {});
  const theme: EditorTheme = "tokyo-night";
  const language = "typescript";
  const monaco = useMonaco();
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const { settings } = useLocalState();

  const handleRun = async () => {
    const resultsText = await runJavascript(code);
    console.log("resultsText", resultsText);
    setResults(resultsText.join("\n"));
  };

  const openSettings = () => {
    setIsSettingsDialogOpen(true);
  };

  useEffect(() => {
    // TODO - convert this into a theme hook
    if (monaco) {
      monaco.editor.defineTheme("tokyo-night", tokyoNightTheme);
      monaco.editor.setTheme("tokyo-night");
      monaco.editor.addEditorAction({
        id: "executeCurrentAndAdvance",
        label: "Execute Block and Advance",
        keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
        contextMenuGroupId: "2_execution",
        run: () => {
          handleRunRef.current();
        },
      });
    }
  }, [monaco]);

  useEffect(() => {
    handleRunRef.current = handleRun;
  }, [handleRun]);

  return (
    <>
      <div className={styles.container}>
        <NavigationRail
          top={<FAB icon={<HiMiniPlay size={24} color="rgb(46, 16, 101)" />} onClick={handleRun} />}
          bottom={
            <NavigationRail.Item
              icon={<LuSettings size={24} color="white" />}
              onClick={openSettings}
            />
          }
        />
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
      <SettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
      />
    </>
  );
}

export default App;
