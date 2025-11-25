import * as fs from "fs";
import * as path from "path";
import { FolderSchema } from "../compile-folder-to-schema/compileFolderToSchema";

const generatePageFile = (file: FolderSchema["files"]) => {
    return `import * as React from "react";
    ${file["fallback"] ? file["fallback"].importString : ""}
    ${file["lazy.page"]?.importString}

    ${file["page"]?.export === "default" ? "export default" : "export"} const ${file.page?.componentName} = () => {
        return React.createElement(
            React.Suspense,
            { fallback: React.createElement(${file["fallback"] ? "ProductFallback" : "() => null"}, null) },
            React.createElement(Lazy${file["page"]?.componentName}, null)
        )
    }
    
    `
}

export const compileLazyPages = (schema: FolderSchema, rootFolder: string): Array<{ path: string, file: string, lazyPath: string, lazyFile: string }> => {
    const out: Array<{ path: string, file: string, lazyPath: string, lazyFile: string }> = [];
    if (schema.files["lazy.page"] && schema.files["page"]) {
        const rawFile = fs.readFileSync(schema.files["page"].path, "utf-8");
        out.push({ lazyPath: schema.files["lazy.page"].path, lazyFile: rawFile, path: schema.files["page"].path, file: generatePageFile(schema.files) })
    }
    return schema.subroutes.reduce((acc, el) => {
        acc.push(...compileLazyPages(el, rootFolder));
        return acc;
    }, out);
};