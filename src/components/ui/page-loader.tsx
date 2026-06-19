"use client";

import { Package } from "lucide-react";

function S({ w = "full", h = "3" }: { w?: string; h?: string }) {
  return <div className={`skeleton h-${h} w-${w} rounded-xl`} />;
}

/* ─── Stat row skeleton ──────────────────────────────────────────── */
export function StatRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft space-y-3">
          <div className="flex items-start justify-between">
            <S w="24" h="2.5" />
            <div className="skeleton h-9 w-9 rounded-xl" />
          </div>
          <S w="28" h="7" />
          <S w="20" h="2" />
        </div>
      ))}
    </div>
  );
}

/* ─── Table skeleton ─────────────────────────────────────────────── */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white shadow-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
        <S w="32" h="3" />
        <div className="ml-auto flex gap-2">
          <div className="skeleton h-8 w-24 rounded-full" />
          <div className="skeleton h-8 w-20 rounded-full" />
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="skeleton h-10 w-10 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <S w="1/3" h="3" />
              <S w="1/4" h="2.5" />
            </div>
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-8 w-8 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card grid skeleton ─────────────────────────────────────────── */
export function CardGridSkeleton({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft space-y-3">
          <div className="flex items-start justify-between">
            <div className="skeleton h-11 w-11 rounded-2xl" />
            <div className="skeleton h-5 w-16 rounded-full" />
          </div>
          <S w="3/5" h="4" />
          <S w="full" h="3" />
          <S w="4/5" h="3" />
          <S w="3/4" h="3" />
        </div>
      ))}
    </div>
  );
}

/* ─── Branded full-page loading overlay ─────────────────────────── */
export function BrandedLoader({ label = "Memuat…", fullPage = false }: { label?: string; fullPage?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${fullPage ? "min-h-[60dvh]" : "py-20"}`}>
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
          <Package size={18} />
        </div>
      </div>
      <p className="text-xs font-bold text-slate-400 animate-pulse">{label}</p>
    </div>
  );
}

/* ─── Inline spinner for buttons / small contexts ────────────────── */
export function Spinner({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/* ─── Dashboard-style loading page (renders inside DashboardShell) ── */
export function DashboardPageLoader() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-6 p-6">
      {/* Centered branded spinner */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-brand-100 border-t-brand-500" />
          {/* Inner pulse ring */}
          <div className="absolute inset-[6px] animate-pulse rounded-full border-2 border-brand-200/40" />
          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
            <Package size={22} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat data…</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-300">Mohon tunggu sebentar</p>
        </div>
      </div>

      {/* Content skeleton — faded behind the loader */}
      <div className="w-full max-w-4xl space-y-4 opacity-30 pointer-events-none">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48 rounded-xl" />
            <div className="skeleton h-3.5 w-64 rounded-lg" />
          </div>
          <div className="skeleton h-10 w-32 rounded-full" />
        </div>
        <StatRowSkeleton count={4} />
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}
