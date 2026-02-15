import { Link } from "react-router-dom";
import { NavLinkToPage, LinkToPage } from "@enhancd/react-file-router";
import { DetailLazyPage } from "./@id/Detail.lazy.page";

const ENTRIES = Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
    label: `Entry ${i + 1}`,
    hint: i === 0
        ? "Try a non-numeric ID in the URL to trigger the error boundary."
        : "A lazy-loaded detail page — code split by the Vite plugin.",
}));

export const SectionPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Section</h1>
        <p className="text-slate-400 mb-8">
            Each card links to a lazy-loaded route at{" "}
            <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">/section/:id</code>.
            The active card is highlighted via{" "}
            <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">NavLinkToPage</code>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ENTRIES.map(({ id, label, hint }) => (
                <NavLinkToPage
                    key={id}
                    to={DetailLazyPage}
                    params={{ id }}
                    className={({ isActive }) =>
                        `block rounded-xl border p-5 transition-all ${
                            isActive
                                ? "bg-indigo-950/60 border-indigo-600 shadow-lg"
                                : "bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60"
                        }`
                    }
                >
                    <p className="text-xs font-mono text-slate-500 mb-1">#{id}</p>
                    <p className="font-semibold text-slate-200 mb-1">{label}</p>
                    <p className="text-slate-500 text-xs">{hint}</p>
                </NavLinkToPage>
            ))}
        </div>

        <div className="mt-8 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-slate-500">Boundary demos:</span>
            <Link
                to="/section/a/b"
                className="font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            >
                /section/a/b → 404
            </Link>
            <LinkToPage
                to={DetailLazyPage}
                params={{ id: "not-a-number" }}
                className="font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            >
                /section/not-a-number → error
            </LinkToPage>
        </div>
    </div>
);
