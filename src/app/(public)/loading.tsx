import { Package } from "lucide-react";

function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`warm-shimmer rounded-xl ${className}`} />;
}

export default function PublicLoading() {
  return (
    <div className="warm-canvas min-h-screen overflow-hidden">

      {/* ─── Hero skeleton ──────────────────────────────────────────── */}
      <section className="border-b border-slate-200/50 px-6 pb-20 pt-24 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Left */}
            <div className="space-y-5">
              <div className="flex gap-2">
                <Shimmer className="h-7 w-44" />
                <Shimmer className="h-7 w-32" />
              </div>
              <div className="space-y-3">
                <Shimmer className="h-14 w-full max-w-md" />
                <Shimmer className="h-14 w-full max-w-xs" />
              </div>
              <div className="space-y-2.5">
                <Shimmer className="h-4 w-full max-w-lg" />
                <Shimmer className="h-4 w-4/5 max-w-lg" />
                <Shimmer className="h-4 w-3/5 max-w-md" />
              </div>
              <div className="flex gap-3 pt-2">
                <Shimmer className="h-12 w-44 !rounded-full" />
                <Shimmer className="h-12 w-36 !rounded-full" />
              </div>
              <div className="flex flex-wrap gap-5 pt-1">
                {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="h-3.5 w-32" />)}
              </div>
            </div>

            {/* Right: dashboard preview skeleton */}
            <div className="hidden lg:block">
              <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-[0_32px_80px_rgba(15,23,42,0.08)] space-y-4">
                {/* Chrome */}
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 p-3">
                  <div className="h-3 w-3 rounded-full bg-rose-300/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-300/60" />
                  <div className="h-3 w-3 rounded-full bg-emerald-300/60" />
                  <Shimmer className="ml-4 h-4 w-36 !rounded-full" />
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => <Shimmer key={i} className="h-16" />)}
                </div>
                {/* Chart */}
                <div className="rounded-xl bg-slate-50 p-3">
                  <Shimmer className="mb-3 h-3 w-24" />
                  <div className="flex h-16 items-end gap-1">
                    {[35, 55, 40, 70, 50, 80, 65, 88, 60, 95, 75, 100].map((h, i) => (
                      <div key={i} className="flex flex-1 flex-col justify-end h-full">
                        <div className="warm-shimmer w-full rounded-t-sm" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Rows */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2.5 px-2">
                    <Shimmer className="h-7 w-7 !rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Shimmer className="h-2.5 w-28" />
                      <Shimmer className="h-2 w-20" />
                    </div>
                    <Shimmer className="h-2 w-16 !rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats skeleton ─────────────────────────────────────────── */}
      <div className="border-b border-slate-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-8 sm:grid-cols-4 sm:divide-x sm:divide-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <Shimmer className="h-9 w-20" />
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-2.5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Feature cards skeleton ─────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-3 mb-14">
            <Shimmer className="mx-auto h-7 w-32 !rounded-full" />
            <Shimmer className="mx-auto h-12 w-80" />
            <Shimmer className="mx-auto h-4 w-64" />
          </div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {/* Big card */}
            <div className="col-span-2 lg:row-span-2 rounded-3xl bg-gradient-to-br from-brand-200/40 to-indigo-200/30 p-7 space-y-4">
              <Shimmer className="h-13 w-13 !rounded-2xl" />
              <Shimmer className="h-7 w-48" />
              <div className="space-y-2.5">
                {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="h-3.5 w-full" />)}
              </div>
              <div className="mt-4 rounded-2xl bg-white/30 p-4 space-y-2">
                <Shimmer className="h-2.5 w-16" />
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Shimmer className="h-2.5 w-32" />
                    <Shimmer className="h-2.5 w-16" />
                  </div>
                ))}
              </div>
            </div>
            {/* Small cards — colored tinted */}
            {[
              "from-rose-200/40 to-pink-200/30",
              "from-teal-200/40 to-emerald-200/30",
              "from-violet-200/40 to-purple-200/30",
              "from-amber-200/40 to-orange-200/30",
              "from-sky-200/40 to-blue-200/30",
              "from-emerald-200/30 to-green-200/20",
            ].map((c, i) => (
              <div key={i} className={`rounded-3xl bg-gradient-to-br ${c} p-5 space-y-3`}>
                <Shimmer className="h-6 w-6 !rounded-lg" />
                <Shimmer className="h-4 w-28" />
                <Shimmer className="h-3 w-full" />
                <Shimmer className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Centered branded loader */}
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-brand-100 border-t-brand-500" />
          <div className="absolute inset-[6px] animate-pulse rounded-full border-2 border-brand-200/40" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
            <Package size={22} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat Zoya ERP…</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-300">Mohon tunggu sebentar</p>
        </div>
      </div>
    </div>
  );
}
