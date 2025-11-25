import { Outlet } from "react-router";

export const AboutLayout = () => {
    
    return (
        <div className="relative p-8 bg-green-500">
            <div className="absolute right-1 top-1 text-sm">Index Layout</div>
            <Outlet />
        </div>
    )
};