import { useNavigateToPage } from "@enhancd/react-file-router";
import { SectionPage } from "@router";

export const DetailLazyPage = (params: { id: string }) => {
    const navigateTo = useNavigateToPage();
    if (isNaN(Number(params.id))) throw Error(`"${params.id}" is not a valid ID`);

    return (
        <div className="max-w-lg">
            <button
                onClick={() => navigateTo(SectionPage)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
            >
                ← Back to Section
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">
                    <span className="text-6xl font-bold text-indigo-400 select-none">#{params.id}</span>
                </div>
                <div className="p-6">
                    <p className="text-xs font-mono text-slate-500 mb-1">id: {params.id}</p>
                    <h1 className="text-2xl font-bold text-slate-100 mb-3">Entry {params.id}</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        This page is lazy-loaded — the Vite plugin automatically wraps it in{" "}
                        <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">React.lazy</code> +{" "}
                        <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">React.Suspense</code>.
                        The back button uses{" "}
                        <code className="text-xs bg-slate-800 px-1 rounded text-slate-300">useNavigateToPage</code>.
                    </p>
                    <div className="flex gap-2">
                        <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">.lazy.page.tsx</span>
                        <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">React.lazy</span>
                        <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">Suspense</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
