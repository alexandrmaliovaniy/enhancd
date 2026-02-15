# @enhancd/react-file-router

File-based routing for Vite + React apps using react-router-dom V6. Automatically generates routes from a directory structure — no manual `RouteObject` configuration needed.

## Installation

```
npm i @enhancd/react-file-router react-router-dom
```

> `react` and `react-dom` are also required as peer dependencies if not already installed.

## Getting Started

### 1. Add the Vite plugin

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reactFileRouterVitePlugin } from "@enhancd/react-file-router/vite-plugin";
import * as path from "path";

export default defineConfig({
  plugins: [
    react(),
    reactFileRouterVitePlugin(),
  ],
  resolve: {
    alias: {
      // optional but recommended — lets you import pages as `import { AboutPage } from "@router"`
      "@router": path.resolve(__dirname, "./src/$router"),
    },
  },
});
```

### 2. Set up TypeScript types

`virtual:react-file-router-schema` is a Vite virtual module. TypeScript needs an ambient declaration so it can type-check imports from it. Create `src/vite-env.d.ts` (or add to an existing one):

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

declare module "virtual:react-file-router-schema" {
  import type { RouteObject } from "react-router-dom";
  const schema: RouteObject[];
  export default schema;
}
```

### 3. Set up the router provider

```typescript
// src/main.tsx
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routerSchema from "virtual:react-file-router-schema";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter(routerSchema)} />
  </StrictMode>
);
```

### 4. Create the `$router` directory

Create `src/$router/` and add route files following the naming conventions below.

## File Naming Conventions

Route files live inside `src/$router/` and follow the pattern `Name.type.tsx`:

| Suffix | Purpose | Example filename | Example component name |
|--------|---------|-----------------|----------------------|
| `.page.tsx` | Page component | `Index.page.tsx` | `IndexPage` |
| `.lazy.page.tsx` | Lazy-loaded page (code split) | `Home.lazy.page.tsx` | `HomeLazyPage` |
| `.layout.tsx` | Layout wrapper (renders `<Outlet />`) | `Index.layout.tsx` | `IndexLayout` |
| `.404.tsx` | Not-found page for this route level | `Index.404.tsx` | `Index404` |
| `.error.tsx` | Error boundary for this route level | `Index.error.tsx` | `IndexError` |
| `.fallback.tsx` | Suspense fallback for a lazy page | `Home.fallback.tsx` | `HomeFallback` |

**Component naming rule:** each `.`-separated part of the filename (excluding the file extension) is PascalCased and concatenated. `my.product.page.tsx` → `MyProductPage`.

## Folder Naming Conventions

Sub-route folders inside `$router` must start with `$` or `@`:

| Prefix | Meaning | Folder name | Generated path |
|--------|---------|-------------|----------------|
| `$` | Static path segment | `$products` | `/products` |
| `@` | Dynamic URL parameter | `@productId` | `/:productId` |

Nesting maps directly to URL nesting:

```
$router/
├── $products/          → /products
│   └── @productId/     → /products/:productId
└── $about/             → /about
```

## Directory Structure Example

```
src/$router/
├── index.ts                              ← re-exports all page components
├── Index.page.tsx                        ← /
├── Index.layout.tsx                      ← layout wrapping all children
├── Index.404.tsx                         ← shown for unmatched routes
├── Index.error.tsx                       ← error boundary for root
│
├── $about/
│   └── About.page.tsx                    ← /about
│
└── $products/
    ├── Products.page.tsx                 ← /products
    ├── Products.error.tsx                ← error boundary for /products
    │
    └── @productId/
        ├── Product.lazy.page.tsx         ← /products/:productId (lazy loaded)
        ├── Product.fallback.tsx          ← shown while lazy chunk loads
        └── Product.error.tsx             ← error boundary for /products/:productId
```

## Route Types in Detail

### Page (`.page.tsx`)

The main component rendered at a route. For dynamic routes the URL parameters are passed as props:

```typescript
// $router/$products/@productId/Product.page.tsx
export const ProductPage = (params: { productId: string }) => {
  return <div>Product: {params.productId}</div>;
};
```

### Lazy Page (`.lazy.page.tsx`)

Same as a page but code-split into a separate bundle chunk. The plugin automatically wraps it in `React.lazy` + `React.Suspense`. Use a `.fallback.tsx` in the same folder to show UI while the chunk loads:

```typescript
// $router/$products/@productId/Product.lazy.page.tsx
export const ProductLazyPage = (params: { productId: string }) => {
  return <div>Product: {params.productId}</div>;
};
```

```typescript
// $router/$products/@productId/Product.fallback.tsx
export const ProductFallback = () => <div>Loading...</div>;
```

If no `.fallback.tsx` is present, nothing is rendered while the chunk loads.

### Layout (`.layout.tsx`)

Wraps all child routes at the same level. Must render `<Outlet />` where children should appear:

```typescript
// $router/Index.layout.tsx
import { Outlet } from "react-router-dom";

export const IndexLayout = () => (
  <div>
    <nav>My Nav</nav>
    <Outlet />
  </div>
);
```

### 404 Page (`.404.tsx`)

Rendered when no child routes match. Compiled to a `{ path: "*" }` catch-all route:

```typescript
// $router/Index.404.tsx
import { NavLink } from "react-router-dom";

export const Index404 = () => (
  <div>
    <h1>Page not found</h1>
    <NavLink to="/">Go home</NavLink>
  </div>
);
```

### Error Page (`.error.tsx`)

Used as the `errorElement` for its route level. Catches render errors thrown by the page component or any of its children:

```typescript
// $router/$products/Products.error.tsx
export const ProductsError = () => (
  <div>Something went wrong loading products.</div>
);
```

## Type-Safe Navigation

All navigation APIs accept page components instead of string paths. TypeScript infers the required URL params directly from the component's props — omitting a required param is a compile-time error.

### `route(page, params?)`

Generates a path string from a page component reference.

```typescript
import { route } from "@enhancd/react-file-router";
import { AboutPage, ProductLazyPage } from "@router";

route(AboutPage)                            // → "/about"
route(ProductLazyPage, { productId: "1" }) // → "/products/1"
```

### `NavLinkToPage`

Wrapper around react-router-dom's `NavLink`. All `NavLink` props are supported, including the `className` function that receives `{ isActive }`.

```typescript
import { NavLinkToPage } from "@enhancd/react-file-router";
import { AboutPage, ProductLazyPage } from "@router";

<NavLinkToPage
  to={AboutPage}
  className={({ isActive }) => isActive ? "active" : ""}
>
  About
</NavLinkToPage>

<NavLinkToPage to={ProductLazyPage} params={{ productId: "1" }}>
  Product 1
</NavLinkToPage>
```

### `LinkToPage`

Wrapper around react-router-dom's `Link`. Use when active-state styling is not needed.

```typescript
import { LinkToPage } from "@enhancd/react-file-router";
import { AboutPage, ProductLazyPage } from "@router";

<LinkToPage to={AboutPage}>About</LinkToPage>
<LinkToPage to={ProductLazyPage} params={{ productId: "1" }}>Product 1</LinkToPage>
```

### `useNavigateToPage()`

Hook that returns a type-safe navigate function. Useful in event handlers, form submissions, and effects.

```typescript
import { useNavigateToPage } from "@enhancd/react-file-router";
import { AboutPage, ProductLazyPage } from "@router";

export const MyComponent = () => {
  const navigateTo = useNavigateToPage();

  return (
    <>
      <button onClick={() => navigateTo(AboutPage)}>Go to About</button>
      <button onClick={() => navigateTo(ProductLazyPage, { params: { productId: "1" } })}>
        Go to Product 1
      </button>
    </>
  );
};
```

The second argument also accepts all standard `NavigateOptions` from react-router-dom (`replace`, `state`, etc.) alongside `params`.

### `NavigateToPage`

Declarative redirect component — a wrapper around react-router-dom's `Navigate`. Redirects immediately when rendered.

```typescript
import { NavigateToPage } from "@enhancd/react-file-router";
import { AboutPage } from "@router";

// Redirect when a condition is met
if (isLoggedOut) return <NavigateToPage to={AboutPage} replace />;
```

## Re-exporting Pages (Recommended)

Add `index.ts` files to each folder to create a single import point for all page components:

```typescript
// $router/index.ts
export * from "./Index.page";
export * from "./$about";
export * from "./$products";

// $router/$products/index.ts
export * from "./Products.page";
export * from "./@productId";

// $router/$products/@productId/index.ts
export * from "./Product.lazy.page";
```

Then import everything from the `@router` alias:

```typescript
import { IndexPage, AboutPage, ProductsPage, ProductLazyPage } from "@router";
```

## Vite Plugin Options

```typescript
reactFileRouterVitePlugin({
  rootDir?: string,   // project root (default: vite config root)
  workDir?: string,   // subdirectory inside root (default: "src")
  routerDir?: string, // router folder name (default: "$router")
})
```

The plugin looks for routes at `{rootDir}/{workDir}/{routerDir}/`.

```typescript
// Default: {project}/src/$router/
reactFileRouterVitePlugin()

// Custom folder name
reactFileRouterVitePlugin({ routerDir: "pages" })
// → {project}/src/pages/

// Custom work directory
reactFileRouterVitePlugin({ workDir: "app" })
// → {project}/app/$router/
```

## How It Works

At startup (and on file changes in dev mode) the Vite plugin:

1. Scans the `$router` directory recursively to build a route schema from folder and file names.
2. Generates a virtual module (`virtual:react-file-router-schema`) containing the full `RouteObject[]` array and registers each page component in `window.__ENHANCD_REACT_FILE_ROUTER__` for use by `route()`.
3. For `.lazy.page.tsx` files, generates a wrapper module that uses `React.lazy` + `React.Suspense` so the actual page code is split into a separate chunk.
4. Hot-reloads automatically when route files are added, removed, or renamed.

The `routerSchema` default export you import from `virtual:react-file-router-schema` and pass to `createBrowserRouter()` resolves to this virtual module at build/dev time — no generated files are written to disk.
