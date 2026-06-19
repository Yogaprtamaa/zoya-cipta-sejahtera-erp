"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Shield, Users, BarChart3, Package } from "lucide-react";
import { setSession, roleHome } from "@/lib/auth-mock";
import { Card } from "@/components/ui";
import type { Role } from "@/types";

const demoUsers: { role: Role; icon: React.ElementType; label: string; desc: string; color: string }[] = [
  {
    role: "agent",
    icon: Package,
    label: "Masuk sebagai Agen",
    desc: "Nadia Putri · Kab. Bandung · Akun aktif",
    color: "bg-brand-50 text-brand-600",
  },
  {
    role: "admin",
    icon: Shield,
    label: "Masuk sebagai Super Admin",
    desc: "Backoffice penuh — kelola agen, produk, order",
    color: "bg-slate-100 text-slate-600",
  },
  {
    role: "director",
    icon: BarChart3,
    label: "Masuk sebagai Direktur",
    desc: "Approval order besar & laporan eksekutif",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    role: "prospect",
    icon: Users,
    label: "Masuk sebagai Prospek",
    desc: "Calon agen — akses portal onboarding",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const enter = (role: Role) => {
    setSession(role, role === "prospect" ? "pending" : "active");
    router.push(roleHome[role]);
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-brand">
          <LogIn size={24} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-black tracking-tight text-slate-900">
          Masuk ke Portal
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Ini adalah demo login — pilih peran untuk mencoba alur lengkapnya.
        </p>
      </div>

      <Card className="space-y-2 p-4">
        {demoUsers.map((u) => (
          <button
            key={u.role}
            onClick={() => enter(u.role)}
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-200/70 p-4 text-left transition-all hover:border-brand-200 hover:bg-brand-50/40 cursor-pointer"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${u.color}`}>
              <u.icon size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900">{u.label}</div>
              <div className="text-xs font-medium text-slate-400 truncate">{u.desc}</div>
            </div>
            <LogIn size={15} className="shrink-0 text-slate-300" />
          </button>
        ))}
      </Card>

      <p className="mt-6 text-center text-xs font-medium text-slate-400">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-bold text-brand-600 hover:text-brand-700">
          Daftar sebagai agen
        </Link>
      </p>
    </main>
  );
}
