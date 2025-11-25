import * as path from "path";
import { reactFileRouterVitePlugin } from "../vitePlugin";

describe("Vite plugin", () => {
  it("Init", () => {

    const routerPluginObj = reactFileRouterVitePlugin();

    expect(routerPluginObj.name).toEqual("better-react-file-router");
    expect(routerPluginObj.enforce).toEqual("pre");
    expect(typeof routerPluginObj.configResolved).toBe("function");
    expect(typeof routerPluginObj.resolveId).toBe("function");
    expect(typeof routerPluginObj.load).toBe("function");
  });

});
