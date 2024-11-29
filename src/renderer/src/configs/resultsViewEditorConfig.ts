import { EditorOptions } from "../types/CodeEditorTypes";

const resultsViewEditorConfig: EditorOptions = {
  readOnly: true,
  folding: false,
  hideCursorInOverviewRuler: true,
  cursorStyle: "block",
  cursorBlinking: "solid",
  renderLineHighlight: "none",
  renderWhitespace: "none",
  matchBrackets: "never",
  selectionHighlight: false,
  links: false,
  codeLens: false,
  // glyphMargin: false,
  // lineDecorationsWidth: 0,
  // lineNumbersMinChars: 0,
};

export { resultsViewEditorConfig };
