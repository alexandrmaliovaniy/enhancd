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
            { fallback: React.createElement(${file["fallback"] ? file["fallback"].componentName : "() => null"}, null) },
            React.createElement(Lazy${file["page"]?.componentName}, null)
        )
    }

    `
}

export const compileLazyPages = (schema: FolderSchema, rootFolder: string): Record<string, { rawFile: string, lazy: boolean }> => {
    const out: Record<string, { rawFile: string, lazy: boolean }> = {};
    if (schema.files["lazy.page"] && schema.files["page"]) {
        const rawFile = fs.readFileSync(schema.files["page"].path, "utf-8");
        out[schema.files["lazy.page"].path] = { lazy: true, rawFile };
        out[schema.files["page"].path] = { lazy: false, rawFile: generatePageFile(schema.files) };
    }
    return schema.subroutes.reduce((acc, el) => {
        return { ...acc, ...compileLazyPages(el, rootFolder) };
    }, out);
};
