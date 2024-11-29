import { EditorThemeConfig } from "../types/CodeEditorTypes";

const tokyoNightTheme: EditorThemeConfig = {
  base: "vs-dark", // Dark theme base
  inherit: true, // Inherit Monaco base dark theme styles
  rules: [
    { token: "comment", foreground: "#51597d", fontStyle: "italic" }, // Comments
    { token: "constant.language", foreground: "#ff9e64" }, // Constants, booleans, numbers
    { token: "constant.numeric", foreground: "#ff9e64" }, // Numbers
    { token: "string", foreground: "#9ece6a" }, // Strings
    { token: "variable", foreground: "#c0caf5" }, // Variables
    { token: "variable.parameter", foreground: "#e0af68" }, // Parameters
    { token: "keyword", foreground: "#bb9af7" }, // Keywords
    { token: "keyword.operator", foreground: "#bb9af7" }, // Operators
    { token: "keyword.control", foreground: "#bb9af7" }, // Control keywords
    { token: "entity.name.tag", foreground: "#f7768e" }, // HTML/XML Tags
    { token: "entity.name.function", foreground: "#7aa2f7" }, // Function names
    { token: "support.function", foreground: "#0db9d7" }, // Support function
    { token: "support.constant", foreground: "#0db9d7" }, // Support constants
    { token: "support.type", foreground: "#0db9d7" }, // Types
    { token: "punctuation", foreground: "#89ddff" }, // Punctuation
  ],
  colors: {
    "editor.foreground": "#c0caf5", // Default text
    "editor.background": "#1a1b26", // Background
    "editorCursor.foreground": "#c0caf5", // Cursor
    "editorLineNumber.foreground": "#363b54", // Line numbers
    "editorLineNumber.activeForeground": "#737aa2", // Active line numbers
    "editor.selectionBackground": "#515c7e4d", // Selection
    "editor.inactiveSelectionBackground": "#515c7e25", // Inactive selection
    "editorBracketMatch.background": "#16161e", // Bracket match
    "editorBracketMatch.border": "#42465d", // Bracket match border
    "editorWhitespace.foreground": "#363b54", // Whitespace
    "editorIndentGuide.background": "#232433", // Indent guides
    "editorIndentGuide.activeBackground": "#363b54", // Active indent guides
    "editor.findMatchBackground": "#3d59a166", // Find match
    "editor.findMatchHighlightBackground": "#3d59a166", // Find match highlight
    "editor.wordHighlightBackground": "#515c7e44", // Word highlight
    "editor.wordHighlightStrongBackground": "#515c7e55", // Strong word highlight
  },
};

export { tokyoNightTheme };
