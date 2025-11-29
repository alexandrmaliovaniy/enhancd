import * as fs from "fs";
import * as path from "path";
import { FolderSchema } from "../compile-folder-to-schema/compileFolderToSchema";
import { routerSchema } from "src/lib/reactFileRouter";


const compileImports = (schema: FolderSchema, rootDir: string): string => {
    const out: string[] = [];
    const fileTypes = Object.keys(schema.files) as `${keyof FolderSchema["files"]}`[];


    fileTypes.forEach(fileType => {
        const file = schema.files[fileType];
        if (["lazy.page", "fallback"].includes(fileType) || !file?.importString) return;
        out.push(file?.importString);
    })

    return [...out, ...schema.subroutes.map(subroutSchema => compileImports(subroutSchema, rootDir))].join("\n").replace(/^\n/gm, "");
}


const compileRoutes = (schema: FolderSchema, rootFolder: string): typeof routerSchema => {
    if (!schema.files.page && !schema.files[404] && !schema.files.layout) return [];
    const element = schema.files.page ? `React.createElement(${schema.files.page.componentName}, null)` : "null";
    const notFoundPage = schema.files[404] ? { path: "*", element: `React.createElement(${schema.files[404].componentName}, null)` } : {};
    if (!schema.files.layout) {
        return [{
            path: schema.files.page?.realtivePath || "",
            errorElement: schema.files.error ? `React.createElement(${schema.files.error.componentName}, null)` : undefined,
            element,
        }, notFoundPage, ...schema.subroutes.map(subrouteSchema => compileRoutes(subrouteSchema, rootFolder)).flat(1)];
    }
    return [{
        path: schema.files.page?.realtivePath || "",
        element: `React.createElement(${schema.files.layout.componentName}, null)`,
        errorElement: schema.files.error ? `React.createElement(${schema.files.error.componentName}, null)` : undefined,
        children: [{ path: "", element }, notFoundPage, ...schema.subroutes.map(subrouteSchema => compileRoutes(subrouteSchema, rootFolder)).flat(1)]
    }]
}
const compilePathInjects = (schema: FolderSchema, rootFolder: string): string => {
    const out = [];

    if (schema.files.page) out.push(`window.__BETTER_REACT_FILE_ROUTER__.set(${schema.files.page.componentName}, "${schema.files.page.realtivePath}");`);

    return [...out, ...schema.subroutes.map(subroutSchema => compilePathInjects(subroutSchema, rootFolder))].join("\n").replace(/^\n/gm, "");
}

export const compileSchemaToRouterFile = (schema: FolderSchema, routerFolder: string, rootFolder: string): string => {
    if (!fs.existsSync(routerFolder)) throw new Error(`Failed to run react-file-router vite plugin. Folder "${routerFolder}" doesn't exist`);

    const imports = compileImports(schema, rootFolder);
    const routes = JSON.stringify(compileRoutes(schema, routerFolder), null, 2).replace(/"(React\.createElement\(\w+, null\))"/g, "$1");

    return `import * as React from "react";
${imports}

export default ${routes}

window.__BETTER_REACT_FILE_ROUTER__ = new Map();
${compilePathInjects(schema, rootFolder)}`;

}
