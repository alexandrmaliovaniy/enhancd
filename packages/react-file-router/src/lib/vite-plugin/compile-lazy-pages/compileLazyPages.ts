import * as fs from "fs";
import { FolderSchema } from "../compile-folder-to-schema/compileFolderToSchema";

const generatePageFile = (file: FolderSchema["files"]) => {
  return `import * as React from "react";
    ${file["fallback"] ? file["fallback"].importString : ""}
    ${file["lazy.page"]?.importString}

    ${file["page"]?.export === "default" ? "export default" : "export"} const ${file.page?.componentName} = (args = {}) => {
        return React.createElement(
            React.Suspense,
            { fallback: React.createElement(${file["fallback"] ? file["fallback"].id : "() => null"}, null) },
            React.createElement(Lazy${file["page"]?.componentName}, { ...args })
        )
    }

    `;
};

export const compileLazyPages = (schema: FolderSchema, rootFolder: string): Record<string, { rawFile: string, lazy: boolean, linkedFile: string }> => {
  const out: Record<string, { rawFile: string, lazy: boolean, linkedFile: string }> = {};
  if (schema.files["lazy.page"] && schema.files["page"]) {
    const rawFile = fs.readFileSync(schema.files["page"].path, "utf-8");
    out[schema.files["lazy.page"].path] = { lazy: true, rawFile, linkedFile: schema.files["page"].path };
    out[schema.files["page"].path] = { lazy: false, rawFile: generatePageFile(schema.files), linkedFile: schema.files["lazy.page"].path };
  }
  return schema.subroutes.reduce((acc, el) => {
    return { ...acc, ...compileLazyPages(el, rootFolder) };
  }, out);
};
