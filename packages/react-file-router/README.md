# @better/react-file-router

### Implements file-based routing for vite react apps using react-router-dom V6

# Instaling

TODO

# Getting started

## Add vite plugin to `vite.config.ts`

```typescript
// vite.config.ts
import { reactFileRouterVitePlugin } from "@better/react-file-router/vite-plugin";

export default defineConfig({
  plugins: [react(), reactFileRouterVitePlugin()],
})
```

## Init react-router provider

```typescript
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routerSchema } from "@better/react-file-router";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routerSchema)} />
  </StrictMode>
);
```

## Create router directory `$router` inside `src`

Inside `$router` directory create your router structure with following conventions:

* subroute folder name start with `$` of `@` sign
* router components are divided in types:
  * page - page itself
  * lazy.page - lazyloaded page
  * layout - component that wraps all childr routes, and displays via react-router `Outlet`
* Router component filenames follows convention: `Name.type.tsx`, ex: `Index.page.tsx`, `Index.layout.tsx`, `Home.lazy.page.tsx`
* Component exported function names follows default react naming convention, ex: `Index.page.tsx` export `IndexPage`

See [examle](../../examples/react-file-router/src/$router/) router structure


## Redirect to page

```typescript
// Index.page.tsx
import { path } from "@better/react-file-router";
import { NavLink } from "react-router-dom";
import { HomeLazyPage, ProductPage } from "@router";

export const IndexPage = () => {
    return (
        <div>
          <NavLink to={path(HomeLazyPage)>To Home</NavLink>
          <NavLink to={path(ProductPage, { productId: "1" })}>To Product #1</NavLink>
        </div>
    )
};

```
