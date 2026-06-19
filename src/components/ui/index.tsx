"use client";

import { ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

/* Reusable UI primitives — small, composable, custom (no shadcn). */

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-amber-100",
  danger: "bg-rose-50 text-rose-700 ring-rose-100",
  info: "bg-blue-50 text-blue-700 ring-blue-100"
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${toneStyles[tone]}`}>{children}</span>;
}

const statusToneMap: Record<string, Tone> = {
  draft: "neutral", not_started: "neutral", none: "neutral", unbilled: "neutral", available: "neutral", lead: "neutral",
  submitted: "info", admin_review: "info", director_review: "info", under_review: "info", uploaded: "info", quote: "info",
  approved: "success", received: "success", completed: "success", verified: "success", paid: "success", active: "success", done: "success", eligible_extra: "success", shipped: "success",
  picking: "warning", packed: "warning", needs_revision: "warning", pending: "warning", under_evaluation: "warning", formulation: "warning", production: "warning", qc: "warning",
  rejected: "danger", reversed: "danger", overdue: "danger", suspended: "danger"
};

export function StatusBadge({ status }: { status: string }) {
  const tone = statusToneMap[status] ?? "neutral";
  const label = status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const dot: Record<Tone, string> = { neutral: "bg-slate-400", brand: "bg-brand-500", success: "bg-emerald-500", warning: "bg-amber-500", danger: "bg-rose-500", info: "bg-blue-500" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${toneStyles[tone]}`}><span className={`h-1.5 w-1.5 rounded-full ${dot[tone]}`} />{label}</span>;
}

type ButtonProps = { variant?: "primary" | "secondary" | "ghost" | "danger" | "dark"; size?: "sm" | "md"; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", size = "md", loading, className = "", children, disabled, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 active:scale-[0.97] focus-visible:outline-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer";
  const sizes = { sm: "px-4 py-2 text-xs", md: "px-6 py-3 text-sm" };
  const variants = {
    primary: "bg-brand-600 text-white shadow-brand hover:bg-brand-700",
    secondary: "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 shadow-soft",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-soft",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-soft"
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={disabled || loading} {...rest}>{loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}{children}</button>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="max-w-2xl text-sm font-medium text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-1.5">
          <span className={i === items.length - 1 ? "text-slate-700" : ""}>{item}</span>
          {i < items.length - 1 && <ChevronRight size={13} className="text-slate-300" />}
        </span>
      ))}
    </nav>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-3xl border border-slate-200/70 bg-white shadow-soft ${className}`}>{children}</div>;
}

export function Stat({ icon, label, value, hint, tone = "brand" }: { icon: React.ReactNode; label: string; value: string; hint?: string; tone?: Tone }) {
  return (
    <Card className="group p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset transition-transform group-hover:scale-110 ${toneStyles[tone]}`}>{icon}</div>
      </div>
      <div className="mt-3 font-display text-2xl font-black tracking-tight text-slate-900">{value}</div>
      {hint && <p className="mt-1 text-xs font-medium text-slate-400">{hint}</p>}
    </Card>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-soft">{icon}</div>
      <h3 className="font-display text-lg font-bold text-slate-700">{title}</h3>
      <p className="max-w-sm text-sm font-medium text-slate-400">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4">
          <div className="skeleton h-9 w-9 rounded-xl" />
          <div className="flex-1 space-y-2"><div className="skeleton h-3 w-1/3" /><div className="skeleton h-2.5 w-1/4" /></div>
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="skeleton h-2.5 w-20 rounded" />
        <div className="skeleton h-9 w-9 rounded-xl" />
      </div>
      <div className="mt-4 skeleton h-7 w-28 rounded" />
      <div className="mt-2 skeleton h-2 w-16 rounded" />
    </Card>
  );
}

export function SkeletonCard({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <Card className={`p-5 space-y-3 ${className}`}>
      <div className="skeleton h-4 w-1/3 rounded" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3 rounded" style={{ width: `${90 - i * 13}%` }} />
      ))}
    </Card>
  );
}

export function SkeletonChart() {
  return (
    <div className="flex h-36 items-end gap-2 px-2">
      {[50, 75, 45, 90, 60, 80, 55, 70, 40, 85].map((h, i) => (
        <div key={i} className="skeleton flex-1 rounded-md" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: Tone }) {
  const bar: Record<Tone, string> = { neutral: "bg-slate-400", brand: "bg-brand-500", success: "bg-emerald-500", warning: "bg-amber-500", danger: "bg-rose-500", info: "bg-blue-500" };
  return <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all duration-500 ${bar[tone]}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 kanban-scrollbar">
      {tabs.map((tab) => (
        <button key={tab} onClick={() => onChange(tab)} className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${active === tab ? "bg-white text-slate-900 shadow-soft" : "text-slate-500 hover:text-slate-700"}`}>{tab}</button>
      ))}
    </div>
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h3 className="font-display text-lg font-black tracking-tight text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer" aria-label="Tutup panel"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

/** Simulates async latency so list pages show a real loading state even on cached fetches. */
export function useMockLoad(delay = 400) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return loading;
}
