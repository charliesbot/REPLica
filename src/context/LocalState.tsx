import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { EditorFont } from "../configs/fontOptions";
import { EditorTheme } from "../configs/themeOptions";

type Settings = {
  vimMode: boolean;
  theme: EditorTheme;
  font: EditorFont;
};

const defaultSettings: Settings = {
  vimMode: false,
  theme: "tokyo-night",
  font: "jetbrains-mono",
};

type LocalStateContextType = {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

type Props = {
  children: ReactNode;
};

const LOCAL_STORAGE_SETTINGS_KEY = "playgroundSettings";

const LocalStateContext = createContext<LocalStateContextType | undefined>(undefined);

export const LocalStateProvider: FC<Props> = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (storedSettings) {
      return { ...defaultSettings, ...JSON.parse(storedSettings) };
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prevSettings: Settings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <LocalStateContext.Provider value={{ settings, updateSetting }}>
      {children}
    </LocalStateContext.Provider>
  );
};

export const useLocalState = (): LocalStateContextType => {
  const context = useContext(LocalStateContext);
  if (!context) {
    throw new Error("useLocalState must be used within a LocalStateProvider");
  }
  return context;
};

export { LocalStateContext };
