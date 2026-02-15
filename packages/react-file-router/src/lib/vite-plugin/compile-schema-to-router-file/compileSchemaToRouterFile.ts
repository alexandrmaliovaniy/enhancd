import * as fs from "fs";
import * as path from "path";
import { FolderSchema } from "../compile-folder-to-schema/compileFolderToSchema";
import { RouteObject } from "react-router-dom";


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


const compileRoutes = (schema: FolderSchema, rootFolder: string): RouteObject[] => {
    if (!schema.files.page && !schema.files[404] && !schema.files.layout) return [];

    const element = schema.files.page ? schema.files.page.realtivePath.search(":") > 0 ? `React.createElement(() => React.createElement(${schema.files.page.id}, useParams()), null)` : `React.createElement(${schema.files.page.id}, null)` : "null";
    const notFoundPage = schema.files[404] ? { path: "*", element: `React.createElement(${schema.files[404].id}, null)` } : {};
    if (!schema.files.layout) {
        return [{
            path: schema.files.page?.realtivePath || "",
            errorElement: schema.files.error ? `React.createElement(${schema.files.error.id}, null)` : undefined,
            element,
        }, notFoundPage, ...schema.subroutes.map(subrouteSchema => compileRoutes(subrouteSchema, rootFolder)).flat(1)];
    }
    return [{
        path: schema.files.page?.realtivePath || "",
        element: `React.createElement(${schema.files.layout.id}, null)`,
        errorElement: schema.files.error ? `React.createElement(${schema.files.error.id}, null)` : undefined,
        children: [{ path: "", element }, notFoundPage, ...schema.subroutes.map(subrouteSchema => compileRoutes(subrouteSchema, rootFolder)).flat(1)]
    }]
}
const compilePathInjects = (schema: FolderSchema, rootFolder: string): string => {
    const out = [];

    if (schema.files.page) out.push(`window.__ENHANCD_REACT_FILE_ROUTER__.set(${schema.files.page.id}, "${schema.files.page.realtivePath}");`);

    return [...out, ...schema.subroutes.map(subroutSchema => compilePathInjects(subroutSchema, rootFolder))].join("\n").replace(/^\n/gm, "");
}

export const compileSchemaToRouterFile = (schema: FolderSchema, routerFolder: string, rootFolder: string): string => {
    if (!fs.existsSync(routerFolder)) throw new Error(`Failed to run react-file-router vite plugin. Folder "${routerFolder}" doesn't exist`);

    const imports = compileImports(schema, rootFolder);
    const routes = JSON.stringify(compileRoutes(schema, routerFolder), null, 2).replace(/"(React\.createElement\(.+, null\))"/g, "$1");

    return `import * as React from "react";
import { useParams } from "react-router-dom"
${imports}

export default ${routes}

window.__ENHANCD_REACT_FILE_ROUTER__ = new Map();
${compilePathInjects(schema, rootFolder)}`;

}
