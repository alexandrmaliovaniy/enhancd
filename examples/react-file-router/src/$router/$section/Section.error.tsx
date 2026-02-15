import { useRouteError } from "react-router-dom";
import { LinkToPage } from "@enhancd/react-file-router";
import { SectionPage, DetailLazyPage } from "@router";

export const SectionError = () => {
    const error = useRouteError() as Error;
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-5xl mb-4 select-none">⚠</p>
            <h1 className="text-xl font-semibold text-slate-300 mb-3">Something went wrong</h1>
            {error?.message && (
                <p className="font-mono text-sm text-red-400 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 mb-10 max-w-md">
                    {error.message}
                </p>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left max-w-sm w-full mb-8">
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded mb-3 inline-block">.error.tsx</span>
                <p className="text-slate-400 text-sm mb-4">
                    Used as the{" "}
                    <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">errorElement</code> for the{" "}
                    <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">/section</code> route. Catches
                    errors thrown by the page or its children at this level.
                </p>
                <p className="text-xs text-slate-500 mb-2">
                    Trigger it — the detail page throws when <code className="text-xs bg-slate-800 px-1 rounded text-slate-400">id</code> is not a number:
                </p>
                <div className="flex flex-col gap-1.5">
                    <LinkToPage
                        to={DetailLazyPage}
                        params={{ id: "not-a-number" }}
                        className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        /section/not-a-number
                    </LinkToPage>
                    <LinkToPage
                        to={DetailLazyPage}
                        params={{ id: "abc" }}
                        className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        /section/abc
                    </LinkToPage>
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
};
