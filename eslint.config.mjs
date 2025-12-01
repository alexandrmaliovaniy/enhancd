import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createConfig = (tsconfigRootDir = __dirname) => defineConfig([
  {
    ignores: ["**/dist/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ignores: ["**/*.config.{js,mjs,cjs,ts,mts,cts}", "**/dist/**", "**/node_modules/**"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.mjs", "*.cjs"],
        },
        tsconfigRootDir,
      }
    }
  },
  // Separate config for config files without type-checking
  {
    files: ["**/*.config.{js,mjs,cjs,ts,mts,cts}"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: globals.node,
    }
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "quotes": ["error", "double"],
      "@typescript-eslint/no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
]);

export default createConfig();
