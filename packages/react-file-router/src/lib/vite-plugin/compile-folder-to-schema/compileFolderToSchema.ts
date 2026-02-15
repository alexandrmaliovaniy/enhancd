import * as fs  from "fs";
import * as path from "path";
import * as crypto from "node:crypto";

export type FolderSchema = {
  folderPath: string;
  files: {
    page?: {
      id: string;
      path: string;
      fileName: string;
      componentName: string;
      realtivePath: string;
      importString: string;
      export: "named" | "default";
    }
    "lazy.page"?: {
      id: string;
      path: string;
      fileName: string;
      componentName: string;
      realtivePath: string;
      importString: string;
      export: "named" | "default";
    },
    layout?: {
      id: string;
      path: string;
      fileName: string;
      componentName: string;
      importString: string;
      export: "named" | "default";
    },
    error?: {
      id: string;
      path: string;
      fileName: string;
      componentName: string;
      importString: string;
      export: "named" | "default";
    },
    fallback?: {
      id: string;
      path: string;
      fileName: string;
      componentName: string;
      importString: string;
      export: "named" | "default";
    },
    "404"?: {
      id: string;
      path: string;
      fileName: string;
      componentName: string;
      importString: string;
      export: "named" | "default";
    },
  };
  subroutes: FolderSchema[]
}


const getFunctionExportType = (fnName: string, rawFile: string): "named" | "default" => {
  if (new RegExp(`export\\s+function\\s+${fnName}`).test(rawFile)) return "named";
  if (new RegExp(`export\\s+const\\s+${fnName}\\s*=\\s*\\(`).test(rawFile)) return "named";
  if (new RegExp(`const\\s+${fnName}\\s*=\\s*function`).test(rawFile) && new RegExp(`export\\s*{[A-Za-z0-9\\s,]*${rawFile}`).test(rawFile)) return "named";
  if (new RegExp(`const\\s+${fnName}\\s*=\\s*\\(`).test(rawFile) && new RegExp(`export\\s*{[A-Za-z0-9\\s,]*${rawFile}`).test(rawFile)) return "named";

  if (new RegExp(`export\\s+default\\s+function\\s+${fnName}`).test(rawFile)) return "default";
  if (new RegExp("export\\s+default\\s+function").test(rawFile)) return "default";
  if (new RegExp(`const\\s+${fnName}\\s*=\\s*function`).test(rawFile) && new RegExp(`export\\s+default\\s+${rawFile}`).test(rawFile)) return "default";
  if (new RegExp(`const\\s+${fnName}\\s*=\\s*\\(`).test(rawFile) && new RegExp(`export\\s+default\\s+${rawFile}`).test(rawFile)) return "default";
  if (new RegExp(`function\\s+${fnName}`).test(rawFile) && new RegExp(`export\\s+default\\s+${rawFile}`).test(rawFile)) return "default";

  return "default";
};

const fileNametoComponentName = (name: string) => {
  return name.split(".").slice(0, -1).map(e => `${e.charAt(0).toUpperCase()}${e.slice(1)}`).join("");
};

const fileImportString = (componentName: string, id: string, path: string, exportType: "named" | "default", lazy = false) => {
  if (lazy && exportType === "named") return `const Lazy${componentName} = React.lazy(() => import("${path}").then(module => { return { default: module.${componentName} } }));`;
  if (lazy && exportType === "default") return `const Lazy${componentName} = React.lazy(() => import("${path}"));`;
  if (exportType === "named") return `import { ${componentName} as ${id} } from "${path}";`;
  return `import ${id} from "${path}";`;
};

export const compileFolderToSchema = (folderPath: string, routerPath = folderPath): FolderSchema => {
  if (!fs.existsSync(folderPath)) throw new Error(`Failed to run react-file-router vite plugin. Folder "${folderPath}" doesn't exist`);
  const dirContent = fs.readdirSync(folderPath);
  const subroutes = [];
  const files: FolderSchema["files"] = { };
  for (const itemName of dirContent) {
    const itemPath = path.join(folderPath, itemName);
    const itemStat = fs.statSync(itemPath);
    if (itemStat.isDirectory() && (itemName.startsWith("@") || itemName.startsWith("$"))) subroutes.push(itemPath);
    if (!itemStat.isFile()) continue;
    const match = itemName.match(/\.(?<type>lazy.page|page|error|layout|fallback|404)\./);
    if (!match || !match.groups) continue;
    const type = match.groups.type as keyof FolderSchema["files"];
    const componentName = fileNametoComponentName(itemName);
    const rawFile = fs.readFileSync(itemPath, "utf-8");
    const exportType = "named" as const;

    const relativePath = path.relative(routerPath, folderPath).replace(/\\/g, "/").replace(/\\/g, "/").replace(/@/g, "/:").replace(/\$/g, "/").replaceAll(/\/+/g, "/") || "/";
    const itemSchema = { path: itemPath.replace(/\\/g, "/"), id: `A${crypto.createHash("sha256").update(`${relativePath}/${itemName}`, "utf-8").digest("hex")}`, fileName: itemName, componentName, realtivePath: relativePath, importString: "", export: exportType };

    itemSchema.importString = fileImportString(itemSchema.componentName, itemSchema.id, itemSchema.path, exportType);
    if (type === "lazy.page") {
      files["page"] = itemSchema;
      files["lazy.page"] = { ...itemSchema, path: `virtual:react-file-router/${itemSchema.id}.tsx` };
      files["lazy.page"].importString = fileImportString(files["lazy.page"].componentName, files["lazy.page"].id, files["lazy.page"].path, files["lazy.page"].export, true);
    } else {
      files[type] = itemSchema;
    }
  }


  return {
    folderPath,
    files,
    subroutes: subroutes.map(subroutePath => compileFolderToSchema(subroutePath, routerPath))
  };
};
