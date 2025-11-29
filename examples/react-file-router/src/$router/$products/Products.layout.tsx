import { Outlet } from "react-router";

export const ProductsLayout = () => {
    return (
        <div className="relative p-8 bg-green-700">
            <div className="absolute right-1 top-1 text-sm">Products Layout</div>
            <Outlet />
        </div>
    )
};

