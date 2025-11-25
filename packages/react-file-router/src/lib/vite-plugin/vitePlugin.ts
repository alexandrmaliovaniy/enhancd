import * as path from "path";
import * as fs from "fs";
import { transform } from "@babel/standalone"
import { Plugin, PluginContainer, ResolvedConfig, ViteDevServer, createServer } from "vite";
import { compileFolderToSchema, FolderSchema } from "./compile-folder-to-schema/compileFolderToSchema";
import { compileSchemaToRouterFile } from "./compile-schema-to-router-file/compileSchemaToRouterFile";
import { compileLazyPages } from "./compile-lazy-pages/compileLazyPages";

export function reactFileRouterVitePlugin(params?: { rootDir?: string, routerDir?: string, workDir?: string }): Plugin {
    let routerFile: string;
    let lazyPages: Array<{ path: string, file: string, lazyPath: string, lazyFile: string }>;
    let config: ResolvedConfig;
    return {
        name: "better-react-file-router",
        enforce: "pre" as const,
        async configResolved(cfg) {
            config = cfg;
            const rootDir = params?.rootDir ?? cfg.root;
            const routerDir = path.join(rootDir, params?.workDir ?? "src", params?.routerDir ?? "$router");

            if (!fs.existsSync(routerDir)) throw new Error(`Folder "${routerDir}" doesn't exist!`)
            const schema = compileFolderToSchema(routerDir);
            routerFile = compileSchemaToRouterFile(schema, routerDir, rootDir);
            lazyPages = compileLazyPages(schema, rootDir);
        },
        resolveId(id: string) {
            if (id.startsWith("virtual:react-file-router-schema")) return "\0" + id;
            for (const page of lazyPages) {
                if (id.startsWith(page.lazyPath)) {
                    return "\0" + id;

                }
            }
        },
        load(id: string) {
            if (id.includes("virtual:react-file-router-schema")) return routerFile;
            for (const page of lazyPages) {
                if (id.includes(page.lazyPath)) return transform(page.lazyFile, {
                    presets: [["react", {
                        pragma: "React.createElement",
                        pragmaFrag: "React.Fragment"
                    }],
                    "typescript"],
                    filename: page.lazyPath,
                    plugins: [["transform-react-jsx", { runtime: "automatic" }]]
                }).code;
                if (id.includes(page.path)) return page.file
            }
        }
    }
};
