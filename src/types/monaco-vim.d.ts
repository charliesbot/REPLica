declare module "monaco-vim" {
  import * as monaco from "monaco-editor";

  export interface EditorVimMode {
    dispose(): void;
    on(event: "vim-mode-change", callback: (args: { mode: string }) => void): void;
  }

  export function initVimMode(
    editor: monaco.editor.IStandaloneCodeEditor,
    statusElement: HTMLElement,
  ): EditorVimMode;
}
