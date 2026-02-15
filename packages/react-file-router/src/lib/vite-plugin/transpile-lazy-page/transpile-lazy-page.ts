import { transform } from "@babel/standalone";

export const transpileLazyPage = async (filename: string, source: string, resolve: (idString: string) => Promise<{ id: string } | null>) => {
  const imports = Array.from(source.matchAll(/^\s*import.+"(?<id>.+)".+/mg));
  const resolvedImports = await Promise.all(imports.map(async match => {
    if (!match.groups?.id) return "";
    const resolvedId = (await resolve(match.groups.id))?.id;

    if (typeof resolvedId !== "string") return "";
    return match[0].replace(match[1], resolvedId);
  }));
  const lastImportelement = imports.at(-1);
  const codeWithoutImports = lastImportelement ? source.slice(lastImportelement.index + lastImportelement[0].length, -1) : source;

  const transpiledCode = transform(codeWithoutImports, {
    presets: [["react", {
      pragma: "React.createElement",
      pragmaFrag: "React.Fragment"
    }],
    "typescript"],
    filename,
    plugins: [["transform-react-jsx", { runtime: "automatic" }]]
  }).code;

  if (!transpiledCode) throw Error(`Babel could transpile file: ${filename}`);


  return resolvedImports.join("") + transpiledCode;
};
