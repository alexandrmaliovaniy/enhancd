import * as path from "path";
import * as fs from "fs";
import { transform } from "@babel/standalone"
import { Plugin, PluginContainer, ResolvedConfig, ViteDevServer, createServer } from "vite";
import { compileFolderToSchema, FolderSchema } from "./compile-folder-to-schema/compileFolderToSchema";
import { compileSchemaToRouterFile } from "./compile-schema-to-router-file/compileSchemaToRouterFile";
import { compileLazyPages } from "./compile-lazy-pages/compileLazyPages";

export function reactFileRouterVitePlugin(params?: { rootDir?: string, routerDir?: string, workDir?: string }): Plugin {
    let routerFile: string;
    let lazyPagesMap: Record<string, { rawFile: string, lazy: boolean }>;
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
        lazyPagesMap = compileLazyPages(schema, rootDir);
      },
      resolveId(id: string) {
        if (id.startsWith("virtual:react-file-router-schema")) return "\0" + id;
        if (lazyPagesMap[id]) return "\0" + id;
      },
      load(id: string) {
        if (id.includes("virtual:react-file-router-schema")) return routerFile;
        const pagePath = id.replace("\0", "");
        const page = lazyPagesMap[pagePath];
        if (page && page.lazy) return transform(page.rawFile, {
                presets: [["react", {
                    pragma: "React.createElement",
                    pragmaFrag: "React.Fragment"
                }],
                "typescript"],
                filename: pagePath,
                plugins: [["transform-react-jsx", { runtime: "automatic" }]]
            }).code;
        if (page && !page.lazy) return page.rawFile;
      },
      handleHotUpdate({ file, server }) {
        const rootDir = params?.rootDir ?? config.root;
        const routerDir = path.join(rootDir, params?.workDir ?? "src", params?.routerDir ?? "$router");
        const relPath = path.relative(routerDir, file);

        if (relPath.startsWith("..")) return;
        const schema = compileFolderToSchema(routerDir);
        routerFile = compileSchemaToRouterFile(schema, routerDir, rootDir);
        lazyPagesMap = compileLazyPages(schema, rootDir);
        const virtualModule = server.moduleGraph.getModuleById("\0virtual:react-file-router-schema");
        if (virtualModule) {
          server.moduleGraph.invalidateModule(virtualModule);
          return [virtualModule];
        }
      }
    }
};
