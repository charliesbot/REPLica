export const fonts = {
  "jetbrains-mono": {
    fontFamily: "JetBrains Mono",
    url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap",
  },
  "cascadia-code": {
    fontFamily: "Cascadia Code",
    url: "https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@4.2.1/index.min.css",
  },
  "ubuntu-mono": {
    fontFamily: "Ubuntu Mono",
    url: "https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap",
  },
  "fira-code": {
    fontFamily: "Fira Code",
    url: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
  },
  "roboto-mono": {
    fontFamily: "Roboto Mono",
    url: "https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap",
  },
} as const;

export const fontOptions = Object.entries(fonts).map(([key, font]) => ({
  value: key,
  label: font.fontFamily,
}));

export type EditorFont = keyof typeof fonts;
