import { tokyoNightTheme } from "../themes/tokyoNight";

export const themes = {
  "tokyo-night": {
    name: "Tokyo Night",
    config: tokyoNightTheme,
  },
} as const;

export const themeOptions = Object.entries(themes).map(([key, theme]) => ({
  value: key,
  label: theme.name,
}));

export type EditorTheme = keyof typeof themes;
