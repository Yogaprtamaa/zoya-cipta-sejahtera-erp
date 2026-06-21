"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { TopLoader } from "@/components/layout/top-loader";
import { Package, Menu, X, Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";
import { RoleSwitcher } from "@/components/layout/role-switcher";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/maklon", label: "Maklon" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="warm-canvas min-h-screen">
      <TopLoader />
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
              <Package size={18} />
            </div>
            <span className="font-display text-xl font-black tracking-tight text-slate-900">
              Zoya<span className="text-brand-500">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  pathname === l.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 shadow-soft transition-colors hover:border-slate-300 sm:inline-block"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="hidden rounded-full bg-brand-600 px-5 py-2 text-xs font-bold text-white shadow-brand transition-colors hover:bg-brand-700 sm:inline-block"
            >
              Daftar Agen
            </Link>
            <RoleSwitcher />
            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-100 px-6 pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    pathname === l.href ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700">
                  Masuk
                </Link>
                <Link href="/daftar" onClick={() => setOpen(false)} className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-bold text-white">
                  Daftar
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {children}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <Package size={18} />
                </div>
                <span className="font-display text-xl font-black tracking-tight text-slate-900">
                  Zoya<span className="text-brand-500">.</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-slate-500">
                Platform distribusi konsinyasi dan layanan maklon herbal & kosmetik terpercaya di Indonesia sejak 2019.
              </p>
              <div className="mt-5 space-y-2.5 text-sm font-medium text-slate-400">
                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>Jl. Raya Industri No. 12, Kec. Rancaekek, Bandung, Jawa Barat 40394</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="shrink-0" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="shrink-0" />
                  <span>info@zoyacipta.co.id</span>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                {[Instagram, Youtube].map((Icon, i) => (
                  <span key={i} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:border-brand-200 hover:text-brand-500 transition-colors cursor-pointer">
                    <Icon size={16} />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Kemitraan</h4>
              <ul className="mt-4 space-y-3">
                {[
                  ["Daftar Sebagai Agen", "/daftar"],
                  ["Ajukan Wilayah", "/konversi"],
                  ["Layanan Maklon", "/maklon"],
                  ["Masuk Portal", "/login"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Layanan</h4>
              <ul className="mt-4 space-y-3">
                {[
                  ["Katalog Produk", "/produk"],
                  ["Jasa Maklon Herbal", "/maklon"],
                  ["Distribusi Konsinyasi", "/"],
                  ["Program Reward Agen", "/"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs font-medium text-slate-400 sm:flex-row">
            <span>© 2026 PT Zoya Cipta Sejahtera · Semua hak dilindungi.</span>
            <span className="italic opacity-70">Prototype demo — bukan sistem produksi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
