import { Package } from "lucide-react";

function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`warm-shimmer rounded-xl ${className}`} />;
}

export default function ProspekLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">

      {/* Hero card skeleton */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-200/40 via-brand-300/30 to-indigo-200/30 p-8 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <Shimmer className="h-7 w-48 !rounded-full" />
            <Shimmer className="h-10 w-64" />
            <Shimmer className="h-10 w-48" />
            <div className="space-y-2">
              <Shimmer className="h-3.5 w-full max-w-sm" />
              <Shimmer className="h-3.5 w-4/5 max-w-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <Shimmer className="h-11 w-40 !rounded-full" />
              <Shimmer className="h-11 w-32 !rounded-full" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="rounded-2xl bg-white/20 p-5 space-y-3">
              <Shimmer className="h-3 w-28" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Shimmer className="h-7 w-7 !rounded-full" />
                  <Shimmer className="h-3.5 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {["from-brand-100/50 to-indigo-100/30", "from-slate-100/60 to-violet-100/30"].map((c, i) => (
          <div key={i} className={`rounded-3xl border border-slate-200/50 bg-gradient-to-br ${c} p-6 space-y-3`}>
            <Shimmer className="h-12 w-12 !rounded-2xl" />
            <Shimmer className="h-6 w-40" />
            <div className="space-y-2">
              <Shimmer className="h-3.5 w-full" />
              <Shimmer className="h-3.5 w-4/5" />
            </div>
            <div className="flex gap-2 pt-2">
              {[1, 2, 3].map((j) => <Shimmer key={j} className="h-6 w-20 !rounded-full" />)}
            </div>
          </div>
        ))}
      </div>

      {/* Content rows */}
      <div className="space-y-3">
        <Shimmer className="h-7 w-52" />
        <Shimmer className="h-4 w-72" />
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200/50 bg-white p-5 space-y-3 shadow-soft">
              <Shimmer className="h-9 w-9 !rounded-xl" />
              <Shimmer className="h-5 w-32" />
              <Shimmer className="h-3.5 w-full" />
              <Shimmer className="h-3.5 w-4/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Centered loader */}
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-brand-100 border-t-brand-500" />
          <div className="absolute inset-[6px] animate-pulse rounded-full border-2 border-brand-200/40" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
            <Package size={22} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat halaman…</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-300">Mohon tunggu sebentar</p>
        </div>
      </div>
    </div>
  );
}
