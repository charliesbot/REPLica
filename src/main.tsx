import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LocalStateProvider } from "./context/LocalState";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LocalStateProvider>
      <App />
    </LocalStateProvider>
  </React.StrictMode>,
);
