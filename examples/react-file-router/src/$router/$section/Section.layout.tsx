import { Outlet } from "react-router-dom";
import { LinkToPage } from "@enhancd/react-file-router";
import { IndexPage } from "@router";

export const SectionLayout = () => (
    <div>
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <LinkToPage to={IndexPage} className="hover:text-slate-300 transition-colors">
                Home
            </LinkToPage>
            <span>/</span>
            <span className="text-slate-300">Section</span>
        </nav>
        <Outlet />
    </div>
);
