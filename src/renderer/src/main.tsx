import "./assets/main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { initMonaco } from "./monaco-config";
import App from "./App";
import { LocalStateProvider } from "./context/LocalState";

initMonaco().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <LocalStateProvider>
        <App />
      </LocalStateProvider>
    </React.StrictMode>,
  );
});
