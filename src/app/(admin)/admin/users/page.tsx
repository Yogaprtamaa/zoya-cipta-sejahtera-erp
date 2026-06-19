"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, StatusBadge, Badge, SkeletonTable } from "@/components/ui";

type Agent = { id: string; name: string; level: string; status: string; email?: string };

export default function AdminUsersPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<{ agents: Agent[] }>("/agen").then((r) => { if (r.data) setAgents(r.data.agents); setLoading(false); }); }, []);

  const staff = [
    { id: "u-admin", name: "Super Admin", level: "admin", status: "active" },
    { id: "u-dir", name: "Direktur Utama", level: "director", status: "active" },
    { id: "u-fin", name: "Finance Officer", level: "finance", status: "active" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Users & Role" subtitle="Akun internal & mitra beserta perannya." />
      <Card className="p-5"><div className="text-xs font-black uppercase tracking-wider text-slate-400">Internal</div><div className="mt-3 flex flex-wrap gap-2">{staff.map((s) => <div key={s.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2"><span className="text-sm font-bold text-slate-800">{s.name}</span><Badge tone="brand">{s.level}</Badge></div>)}</div></Card>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4"><h3 className="font-display text-base font-black text-slate-900">Akun Mitra (Agen)</h3></div>
        {loading ? <div className="p-6"><SkeletonTable rows={4} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">Nama</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Email</th><th className="px-6 py-3">Status</th></tr></thead>
            <tbody className="divide-y divide-slate-50">{agents.map((a) => <tr key={a.id} className="hover:bg-slate-50"><td className="px-6 py-4 font-bold text-slate-900">{a.name}</td><td className="px-4 py-4 font-medium text-slate-500">{a.level}</td><td className="px-4 py-4 font-medium text-slate-500">{a.email ?? "—"}</td><td className="px-6 py-4"><StatusBadge status={a.status} /></td></tr>)}</tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
}
