import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactFileRouterVitePlugin } from "@better/react-file-router/vite-plugin";
import tailwindcss from "@tailwindcss/vite"
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reactFileRouterVitePlugin(), tailwindcss()],
  resolve: {
    alias: {
      "@router": path.resolve(__dirname, "./src/$router")
    }
  }
})
