"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, ChevronDown, RotateCcw } from "lucide-react";
import { setSession, getClientRole, getClientLevel, roleHome } from "@/lib/auth-mock";
import type { Role } from "@/types";

type Entry = { role: Role; level?: string; label: string };

const entries: Entry[] = [
  { role: "guest",        label: "Guest" },
  { role: "prospect",     label: "Prospek" },
  { role: "agent",        level: "agen",      label: "Agen" },
  { role: "agent",        level: "reseller",  label: "Reseller" },
  { role: "klien_maklon", label: "Klien Maklon" },
  { role: "admin",        label: "Super Admin" },
];

function activeLabel(role: Role, level: string): string {
  if (role === "agent") {
    if (level === "reseller")  return "Reseller";
    return "Agen";
  }
  return entries.find((e) => e.role === role && !e.level)?.label ?? "Guest";
}

/** Demo-only role switcher. Sets mock cookies and navigates to that role's home. */
export function RoleSwitcher() {
  const router = useRouter();
  const [open, setOpen]   = useState(false);
  const [role, setRole]   = useState<Role>("guest");
  const [level, setLevel] = useState("agen");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRole(getClientRole());
    setLevel(getClientLevel());
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pick = (e: Entry) => {
    const status = e.role === "prospect" ? "pending" : "active";
    setSession(e.role, status, e.level ?? "agen");
    setRole(e.role);
    setLevel(e.level ?? "agen");
    setOpen(false);
    router.push(roleHome[e.role]);
    router.refresh();
  };

  const isActive = (e: Entry) => {
    if (e.role !== role) return false;
    if (e.role === "agent") return (e.level ?? "agen") === level;
    return true;
  };

  const resetDemo = async () => {
    await fetch("/api/_reset", { method: "POST" }).catch(() => {});
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-soft transition-colors hover:bg-slate-800 cursor-pointer"
      >
        <FlaskConical size={14} className="text-brand-300" />
        <span className="hidden sm:inline">Demo:</span> {activeLabel(role, level)}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft-lg">
          <div className="bg-slate-950 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-300">
            Demo Role Switcher
          </div>
          <div className="p-2">
            {entries.map((e) => (
              <button
                key={`${e.role}-${e.level ?? "default"}`}
                onClick={() => pick(e)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                  isActive(e) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {e.label}
                {isActive(e) && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </button>
            ))}
            <button
              onClick={resetDemo}
              className="mt-1 flex w-full items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
            >
              <RotateCcw size={13} /> Reset Data Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
