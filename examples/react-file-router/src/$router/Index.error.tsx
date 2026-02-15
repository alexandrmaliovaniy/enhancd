import { useRouteError } from "react-router-dom";
import { LinkToPage } from "@enhancd/react-file-router";
import { IndexPage } from "@router";

export const IndexError = () => {
    const error = useRouteError() as Error;
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-6xl mb-4 select-none">⚠</p>
            <h1 className="text-2xl font-semibold text-slate-300 mb-3">Something went wrong</h1>
            {error?.message && (
                <p className="font-mono text-sm text-red-400 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 mb-10 max-w-md">
                    {error.message}
                </p>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left max-w-sm w-full mb-8">
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded mb-3 inline-block">.error.tsx</span>
                <p className="text-slate-400 text-sm">
                    Used as the{" "}
                    <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">errorElement</code> for the root
                    route. Catches errors thrown by the layout, the root page, or any of their children that don't have
                    their own error boundary.
                </p>
            </div>

            <LinkToPage
                to={IndexPage}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
            >
                Back to Home
            </LinkToPage>
        </div>
    );
};
