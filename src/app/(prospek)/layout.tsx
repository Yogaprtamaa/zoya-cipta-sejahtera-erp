import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { RoleSwitcher } from "@/components/layout/role-switcher";

export default function ProspekLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="warm-canvas min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
              <Package size={17} />
            </div>
            <span className="font-display text-xl font-black tracking-tight text-slate-900">
              Zoya<span className="text-brand-500">.</span>
            </span>
          </Link>

          {/* Progress breadcrumb */}
          <div className="hidden items-center gap-1.5 text-xs font-semibold sm:flex">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">Beranda</Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">Area Prospek</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              Status: Prospek
            </div>
            <RoleSwitcher />
          </div>
        </div>
      </nav>

      {children}

      {/* Mini footer */}
      <div className="border-t border-slate-100 py-6 text-center text-xs font-medium text-slate-400">
        © 2026 PT Zoya Cipta Sejahtera ·{" "}
        <Link href="/" className="hover:text-brand-600 transition-colors">Kembali ke Website</Link>
      </div>
    </div>
  );
}
