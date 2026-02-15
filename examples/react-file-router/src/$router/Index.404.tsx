import { Link } from "react-router-dom";
import { LinkToPage } from "@enhancd/react-file-router";
import { IndexPage } from "@router";

export const Index404 = () => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-9xl font-bold text-slate-800 select-none mb-4">404</p>
        <h1 className="text-2xl font-semibold text-slate-300 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-10">The route you're looking for doesn't exist.</p>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left max-w-sm w-full mb-8">
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded mb-3 inline-block">.404.tsx</span>
            <p className="text-slate-400 text-sm mb-4">
                Rendered when no child route matches at this level. Compiled to a{" "}
                <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">{"{ path: '*' }"}</code> catch-all
                route by the Vite plugin.
            </p>
            <p className="text-xs text-slate-500 mb-2">Trigger it — navigate to a non-existent path:</p>
            <div className="flex flex-col gap-1.5">
                <Link to="/does-not-exist" className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    /does-not-exist
                </Link>
                <Link to="/nested/deep/path" className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    /nested/deep/path
                </Link>
            </div>
        </div>

        <LinkToPage
            to={IndexPage}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
        >
            Back to Home
        </LinkToPage>
    </div>
);
