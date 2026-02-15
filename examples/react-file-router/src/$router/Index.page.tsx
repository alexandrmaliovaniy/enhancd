import { useState } from "react";
import { Link } from "react-router-dom";
import { SectionPage, DetailLazyPage } from "@router";
import { NavLinkToPage, LinkToPage, useNavigateToPage, NavigateToPage, route } from "@enhancd/react-file-router";

export const IndexPage = () => {
    const navigateTo = useNavigateToPage();
    const [redirectNow, setRedirectNow] = useState(false);

    if (redirectNow) return <NavigateToPage to={SectionPage} />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-100 mb-2">react-file-router</h1>
                <p className="text-slate-400 text-lg">
                    Type-safe, file-based routing for Vite + React. Navigate using page components — no hardcoded paths.
                </p>
            </div>

            {/* NavLinkToPage */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">NavLinkToPage</span>
                    <h2 className="font-semibold text-slate-200">Active-aware links</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    Wraps <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">NavLink</code> — the active class is applied automatically based on the current URL.
                </p>
                <div className="flex gap-3 flex-wrap">
                    <NavLinkToPage
                        to={SectionPage}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                isActive
                                    ? "bg-indigo-600 border-indigo-500 text-white"
                                    : "border-slate-700 text-slate-300 hover:bg-slate-800"
                            }`
                        }
                    >
                        Section
                    </NavLinkToPage>
                    <NavLinkToPage
                        to={DetailLazyPage}
                        params={{ id: "1" }}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                isActive
                                    ? "bg-indigo-600 border-indigo-500 text-white"
                                    : "border-slate-700 text-slate-300 hover:bg-slate-800"
                            }`
                        }
                    >
                        Entry #1
                    </NavLinkToPage>
                </div>
            </section>

            {/* LinkToPage */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">LinkToPage</span>
                    <h2 className="font-semibold text-slate-200">Simple links</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    Wraps <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">Link</code> — no active-state, just a regular anchor. Params are type-checked.
                </p>
                <div className="flex gap-3 flex-wrap">
                    <LinkToPage to={SectionPage} className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-800 text-emerald-100 hover:bg-emerald-700 transition-colors">
                        Go to Section
                    </LinkToPage>
                    <LinkToPage to={DetailLazyPage} params={{ id: "42" }} className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-800 text-emerald-100 hover:bg-emerald-700 transition-colors">
                        Entry #42
                    </LinkToPage>
                </div>
            </section>

            {/* useNavigateToPage */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-violet-900/60 text-violet-300 px-2 py-0.5 rounded border border-violet-800">useNavigateToPage</span>
                    <h2 className="font-semibold text-slate-200">Programmatic navigation</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    Hook returning a type-safe navigate function — ideal for event handlers, form submissions, and effects.
                </p>
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => navigateTo(SectionPage)}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-700 text-white hover:bg-violet-600 transition-colors"
                    >
                        Navigate to Section
                    </button>
                    <button
                        onClick={() => navigateTo(DetailLazyPage, { params: { id: "7" } })}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-700 text-white hover:bg-violet-600 transition-colors"
                    >
                        Navigate to Entry #7
                    </button>
                </div>
            </section>

            {/* NavigateToPage */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800">NavigateToPage</span>
                    <h2 className="font-semibold text-slate-200">Declarative redirect</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    Renders <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">&lt;Navigate&gt;</code> from react-router-dom — redirects immediately when this component is rendered. Useful in conditional render logic.
                </p>
                <button
                    onClick={() => setRedirectNow(true)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-700 text-white hover:bg-amber-600 transition-colors"
                >
                    Render &lt;NavigateToPage to={"{SectionPage}"} /&gt;
                </button>
            </section>

            {/* route() */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-sky-900/60 text-sky-300 px-2 py-0.5 rounded border border-sky-800">route()</span>
                    <h2 className="font-semibold text-slate-200">Path generation helper</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    Resolves a page component reference to its URL string. TypeScript enforces required params at compile time.
                </p>
                <ul className="space-y-2 font-mono text-sm">
                    <li className="flex items-center gap-3 flex-wrap">
                        <span className="text-slate-500">route(SectionPage)</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-sky-400 bg-slate-800 px-2 py-0.5 rounded">{route(SectionPage)}</span>
                    </li>
                    <li className="flex items-center gap-3 flex-wrap">
                        <span className="text-slate-500">{'route(DetailLazyPage, { id: "42" })'}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-sky-400 bg-slate-800 px-2 py-0.5 rounded">{route(DetailLazyPage, { id: "42" })}</span>
                    </li>
                </ul>
            </section>

            {/* .404.tsx */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded border border-slate-600">.404.tsx</span>
                    <h2 className="font-semibold text-slate-200">Not-found pages</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    Rendered when no child route matches at that level. Compiled to a{" "}
                    <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">{"{ path: '*' }"}</code> catch-all route.
                </p>
                <div className="flex gap-3 flex-wrap">
                    <Link
                        to="/does-not-exist"
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
                    >
                        Index 404
                    </Link>
                    <Link
                        to="/section/a/b"
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
                    >
                        Section 404
                    </Link>
                </div>
            </section>

            {/* .error.tsx */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono bg-slate-700/60 text-slate-300 px-2 py-0.5 rounded border border-slate-600">.error.tsx</span>
                    <h2 className="font-semibold text-slate-200">Error boundaries</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                    Used as the{" "}
                    <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">errorElement</code> for the route.
                    Catches errors thrown by the page or its children at that level.
                </p>
                <div className="flex gap-3 flex-wrap">
                    <LinkToPage
                        to={DetailLazyPage}
                        params={{ id: "not-a-number" }}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
                    >
                        Section error
                    </LinkToPage>
                </div>
            </section>
        </div>
    );
};
