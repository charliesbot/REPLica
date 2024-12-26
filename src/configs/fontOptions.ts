export const fonts = {
  "jetbrains-mono": {
    fontFamily: "JetBrains Mono",
  },
  "cascadia-code": {
    fontFamily: "Cascadia Code",
  },
  "ubuntu-mono": {
    fontFamily: "Ubuntu Mono",
  },
  "fira-code": {
    fontFamily: "Fira Code",
  },
  "roboto-mono": {
    fontFamily: "Roboto Mono",
  },
} as const;

export const fontOptions = Object.entries(fonts).map(([key, font]) => ({
  value: key,
  label: font.fontFamily,
}));

export type EditorFont = keyof typeof fonts;
