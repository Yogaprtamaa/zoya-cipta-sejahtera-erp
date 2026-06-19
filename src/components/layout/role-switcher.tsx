"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, ChevronDown, RotateCcw } from "lucide-react";
import { setSession, getClientRole, roleHome } from "@/lib/auth-mock";
import type { Role } from "@/types";

const roles: { value: Role; label: string }[] = [
  { value: "guest", label: "Guest" },
  { value: "prospect", label: "Prospek" },
  { value: "agent", label: "Agen" },
  { value: "director", label: "Direktur" },
  { value: "admin", label: "Super Admin" }
];

/** Demo-only role switcher. Sets mock cookies and navigates to that role's home. */
export function RoleSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("guest");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setRole(getClientRole()); }, []);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pick = (r: Role) => {
    setSession(r, r === "prospect" ? "pending" : "active");
    setRole(r);
    setOpen(false);
    router.push(roleHome[r]);
    router.refresh();
  };

  const resetDemo = async () => {
    await fetch("/api/_reset", { method: "POST" }).catch(() => {});
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-soft transition-colors hover:bg-slate-800 cursor-pointer">
        <FlaskConical size={14} className="text-brand-300" />
        <span className="hidden sm:inline">Demo:</span> {roles.find((r) => r.value === role)?.label ?? "Guest"}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft-lg">
          <div className="bg-slate-950 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-300">Demo Role Switcher</div>
          <div className="p-2">
            {roles.map((r) => (
              <button key={r.value} onClick={() => pick(r.value)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${role === r.value ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"}`}>
                {r.label}{role === r.value && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </button>
            ))}
            <button onClick={resetDemo} className="mt-1 flex w-full items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer">
              <RotateCcw size={13} /> Reset Data Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
