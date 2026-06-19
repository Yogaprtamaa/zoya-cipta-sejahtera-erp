"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, Search, Home } from "lucide-react";
import { RoleSwitcher } from "./role-switcher";
import { TopLoader } from "./top-loader";
import type { NavSection } from "./nav-config";

type Props = { workspace: string; userName: string; sections: NavSection[]; children: React.ReactNode };

/** Shared dashboard chrome (sidebar + topbar) for agen/admin/direktur route groups. */
export function DashboardShell({ workspace, userName, sections, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = sections.flatMap((s) => s.items).find((i) => i.href === pathname || (i.href !== "/dashboard" && i.href !== "/admin" && pathname.startsWith(i.href)));
  const pageLabel = current?.label ?? "Dashboard";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-black text-white shadow-brand">Z</div>
          <div><div className="text-sm font-black tracking-tight text-slate-950">Zoya Cipta</div><div className="text-[11px] font-semibold text-slate-400">{workspace} Workspace</div></div>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-xl p-2 text-slate-400 hover:bg-slate-100 md:hidden cursor-pointer" aria-label="Tutup menu"><X size={18} /></button>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {sections.map((section, si) => (
          <div key={si} className="space-y-1">
            {section.label && <div className="px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-wider text-slate-300">{section.label}</div>}
            {section.items.map(({ href, label, icon: Icon }) => {
              const active = current?.href === href;
              return (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition-all ${active ? "bg-brand-600 text-white shadow-brand" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                  <Icon size={18} className={active ? "text-white" : "text-slate-400 group-hover:text-brand-600"} /><span>{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <Link href="/" className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"><Home size={18} className="text-slate-400" /> Ke Website</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <TopLoader />
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl md:pl-[19.5rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer" aria-label="Buka menu"><Menu size={20} /></button>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">{workspace} <span className="text-slate-300">/</span> <span className="text-slate-700">{pageLabel}</span></div>
            <h1 className="text-sm font-black tracking-tight text-slate-950">{pageLabel}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-100 lg:flex cursor-pointer" aria-label="Cari"><Search size={15} /> Cari...</button>
          <button className="relative rounded-full p-2.5 text-slate-500 hover:bg-slate-100 cursor-pointer" aria-label="Notifikasi"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" /></button>
          <RoleSwitcher />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-black text-white">{userName.charAt(0)}</div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-0 z-20 hidden w-72 border-r border-slate-200 bg-white md:block">{sidebar}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-slide-in-right">{sidebar}</div>
        </div>
      )}

      <main className="pt-16 md:pl-72">
        <div key={pathname} className="mx-auto max-w-7xl animate-fade-in p-4 pb-24 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
