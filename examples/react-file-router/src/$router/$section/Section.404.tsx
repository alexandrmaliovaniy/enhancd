import { Link } from "react-router-dom";
import { LinkToPage } from "@enhancd/react-file-router";
import { SectionPage } from "@router";

export const Section404 = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-8xl font-bold text-slate-800 select-none mb-4">404</p>
        <h1 className="text-xl font-semibold text-slate-300 mb-2">Entry not found</h1>
        <p className="text-slate-500 mb-10">No entry matches this path.</p>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left max-w-sm w-full mb-8">
            <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded mb-3 inline-block">.404.tsx</span>
            <p className="text-slate-400 text-sm mb-4">
                Catches unmatched routes under{" "}
                <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">/section</code>. A path deeper than{" "}
                <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">/section/:id</code> has no matching
                child, so this page is rendered.
            </p>
            <p className="text-xs text-slate-500 mb-2">Trigger it — navigate to a path too deep to match:</p>
            <div className="flex flex-col gap-1.5">
                <Link to="/section/a/b" className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    /section/a/b
                </Link>
                <Link to="/section/x/y/z" className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    /section/x/y/z
                </Link>
            </div>
        </div>

        <LinkToPage
            to={SectionPage}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
        >
            Back to Section
        </LinkToPage>
    </div>
);
