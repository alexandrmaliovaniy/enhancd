import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import { readFileSync } from "fs";

function logBundledModules() {
  const seen = new Set();

  return {
    name: "log-bundled-modules",
    moduleParsed(info) {
      if (seen.has(info.id)) return;
      seen.add(info.id);
      if (info.id.includes("\0")) return;

      console.log("[bundled]", info.id);
    }
  };
}

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const entries = {
  index: "src/index.ts",
  "vite-plugin": "src/lib/vite-plugin/vitePlugin.ts",
};

const createConfig = (input, output, format) => ({
  input,
  output: {
    file: output,
    format,
    sourcemap: true,
    exports: "named",
    ...(format === "esm" && { preserveModules: false }),
  },
  onwarn(warning, warn) {
    if (warning.code === "UNRESOLVED_IMPORT") {
      throw new Error(warning.message);
    }
    warn(warning);
  },
  plugins: [
    logBundledModules(),
    peerDepsExternal(),
    esbuild({
      include: /\.[jt]sx?$/,
      minify: false,
      target: "es2015",
      jsx: "automatic",
      tsconfig: "tsconfig.json",
    }),
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    }),
    commonjs(),
    terser(),
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    /^virtual:/,
  ],
});

const createDtsConfig = (input, output) => ({
  input,
  output: {
    file: output,
    format: "esm",
  },
  plugins: [
    dts({
      respectExternal: true,
      compilerOptions: {
        declarationMap: false,
      }
    })
  ],
  external: [
    /node_modules/,
    ...Object.keys(pkg.peerDependencies || {}),
    /^virtual:/,
  ],
});

const configs = Object.entries(entries).flatMap(([name, input]) => {
  const outputBase = name === "index" ? "dist/index" : `dist/${name}`;

  return [
    createConfig(input, `${outputBase}.esm.js`, "esm"),
    createConfig(input, `${outputBase}.cjs.js`, "cjs"),
    createDtsConfig(input, `${outputBase}.d.ts`),
  ];
});

export default configs;
