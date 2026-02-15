export const DetailFallback = () => (
    <div className="max-w-lg">
        <div className="w-32 h-4 bg-slate-800 rounded mb-8 animate-pulse" />
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="h-40 bg-slate-800 animate-pulse" />
            <div className="p-6 space-y-3">
                <div className="w-28 h-3 bg-slate-800 rounded animate-pulse" />
                <div className="w-44 h-6 bg-slate-800 rounded animate-pulse" />
                <div className="w-full h-3 bg-slate-800 rounded animate-pulse" />
                <div className="w-3/4 h-3 bg-slate-800 rounded animate-pulse" />
            </div>
        </div>
    </div>
);
