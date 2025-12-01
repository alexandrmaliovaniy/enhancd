import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import "./main.css";
import { DialogProvider } from "@api";
import { App } from "./App";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <DialogProvider>
      <App />
    </DialogProvider>
  </StrictMode>
);
