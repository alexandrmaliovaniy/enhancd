import * as path from "path";
import * as fs from "fs";
import { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { compileFolderToSchema } from "./compile-folder-to-schema/compileFolderToSchema";
import { compileSchemaToRouterFile } from "./compile-schema-to-router-file/compileSchemaToRouterFile";
import { compileLazyPages } from "./compile-lazy-pages/compileLazyPages";
import { transpileLazyPage } from "./transpile-lazy-page/transpile-lazy-page";

export function reactFileRouterVitePlugin(params?: { rootDir?: string, routerDir?: string, workDir?: string }): Plugin {
  let routerFile: string;
  let lazyPagesMap: Record<string, { rawFile: string, lazy: boolean, linkedFile: string }>;
  let config: ResolvedConfig;
  let server: ViteDevServer;

  return {
    name: "enhancd-react-file-router",
    enforce: "pre" as const,
    async configResolved(cfg) {
      config = cfg;
      const rootDir = params?.rootDir ?? cfg.root;
      const routerDir = path.join(rootDir, params?.workDir ?? "src", params?.routerDir ?? "$router");
      if (!fs.existsSync(routerDir)) throw new Error(`Folder "${routerDir}" doesn't exist!`);
      const schema = compileFolderToSchema(routerDir);
      routerFile = compileSchemaToRouterFile(schema, routerDir, rootDir);
      lazyPagesMap = compileLazyPages(schema, rootDir);
    },
    configureServer(viteServer) {
      server = viteServer;
    },
    resolveId(id: string) {
      if (id.startsWith("virtual:react-file-router-schema")) return "\0" + id;
      if (lazyPagesMap[id] && lazyPagesMap[id].lazy) return "\0" + id;
    },
    async load(id: string) {
      if (id.includes("virtual:react-file-router-schema")) return routerFile;
      const pagePath = id.replace("\0", "");
      const page = lazyPagesMap[pagePath];

      if (page && page.lazy) {
        return transpileLazyPage(id, page.rawFile, (source: string) => this.resolve(source, page.linkedFile));

      }
      if (page && !page.lazy) return page.rawFile;
    },
    watchChange(id, change) {
      const rootDir = params?.rootDir ?? config.root;
      const routerDir = path.join(rootDir, params?.workDir ?? "src", params?.routerDir ?? "$router");
      const relPath = path.relative(routerDir, id);

      if (relPath.startsWith("..")) return;
      const schema = compileFolderToSchema(routerDir);
      routerFile = compileSchemaToRouterFile(schema, routerDir, rootDir);
      lazyPagesMap = compileLazyPages(schema, rootDir);
      const virtualModule = server.moduleGraph.getModuleById("\0virtual:react-file-router-schema");
      if (virtualModule) server.moduleGraph.invalidateModule(virtualModule);
      const module = lazyPagesMap[id]?.linkedFile ? server.moduleGraph.getModuleById(`\0${lazyPagesMap[id]?.linkedFile}`) : server.moduleGraph.getModuleById(`\0${id}`);
      if (module) {
        server.moduleGraph.invalidateModule(module);
        module.importers.forEach(importer => {
          server.moduleGraph.invalidateModule(importer);
        });
      }
      server.ws.send({
        type: "full-reload",
        path: "*"
      });
    }
  };
}
