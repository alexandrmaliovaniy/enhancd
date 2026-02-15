import { Outlet } from "react-router-dom";
import { NavLinkToPage } from "@enhancd/react-file-router";
import { IndexPage, SectionPage } from "@router";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        isActive
            ? "bg-indigo-600 text-white"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
    }`;

export const IndexLayout = () => (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <NavLinkToPage to={IndexPage} end className="text-lg font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    react-file-router
                </NavLinkToPage>
                <nav className="flex gap-1">
                    <NavLinkToPage to={IndexPage} end className={navItemClass}>Home</NavLinkToPage>
                    <NavLinkToPage to={SectionPage} className={navItemClass}>Section</NavLinkToPage>
                </nav>
            </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
            <Outlet />
        </main>
        <footer className="border-t border-slate-800 bg-slate-900">
            <div className="max-w-5xl mx-auto px-6 py-5 text-center text-slate-500 text-sm">
                @enhancd/react-file-router — file-based routing for Vite + React
            </div>
        </footer>
    </div>
);
