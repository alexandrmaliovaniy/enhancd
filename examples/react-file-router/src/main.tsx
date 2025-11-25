import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routerSchema } from "@better/react-file-router";
import "./main.css";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routerSchema)} />
  </StrictMode>
);
