import { path } from "@better/react-file-router";
import { NavLink } from "react-router-dom";
import { ProductLazyPage, IndexPage } from "@router";

export const ProductsPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <NavLink to={path(ProductLazyPage, { productId: 1 })}>Product 1</NavLink>
            <NavLink to={path(ProductLazyPage, { productId: 2 })}>Product 2</NavLink>
            <NavLink to={path(ProductLazyPage, { productId: 3 })}>Product 3</NavLink>
            <NavLink to={path(ProductLazyPage, { productId: 4 })}>Product 4</NavLink>
            <NavLink to={path(ProductLazyPage, { productId: 5 })}>Product 5</NavLink>
            <NavLink to={path(ProductLazyPage, { productId: 6 })}>Product 6</NavLink>
            <NavLink to={path(IndexPage, { productId: 6 })}>Back to Index page</NavLink>
        </div>
    )
};
