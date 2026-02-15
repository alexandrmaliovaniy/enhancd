/// <reference types="vite/client" />

declare module "virtual:react-file-router-schema" {
  import type { RouteObject } from "react-router-dom";
  const schema: RouteObject[];
  export default schema;
}
