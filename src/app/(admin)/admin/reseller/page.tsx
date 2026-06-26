"use client";

import { useEffect, useState, useMemo } from "react";
import { Store, Users, CheckCircle2, Info, Search, ChevronDown, ChevronRight, MapPinned, Phone, Mail } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Stat, StatusBadge, Badge, SkeletonTable, EmptyState } from "@/components/ui";

type Agent = {
  id: string;
  name: string;
  level: string;
  parentId: string | null;
  parentName: string | null;
  region: string | null;
  status: string;
  email?: string;
  phone?: string;
  createdAt?: string;
};

type Group = {
  parentId: string;
  parentName: string;
  kabupaten: string | null;
  resellers: Agent[];
  aktif: number;
};

export default function AdminResellerPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.get<{ agents: Agent[] }>("/agen").then((r) => { if (r.data) setAgents(r.data.agents); setLoading(false); });
  }, []);

  const resellers = useMemo(() => agents.filter((a) => a.level === "reseller"), [agents]);

  // Kelompokkan reseller per agen pembina.
  const groups = useMemo<Group[]>(() => {
    const byParent = new Map<string, Agent[]>();
    for (const r of resellers) {
      const key = r.parentId ?? "—";
      (byParent.get(key) ?? byParent.set(key, []).get(key)!).push(r);
    }
    return Array.from(byParent.entries())
      .map(([parentId, list]) => {
        const parent = agents.find((a) => a.id === parentId);
        return {
          parentId,
          parentName: list[0]?.parentName ?? parent?.name ?? "Tanpa Agen Pembina",
          kabupaten: parent?.region ?? null,
          resellers: list.slice().sort((a, b) => a.name.localeCompare(b.name)),
          aktif: list.filter((r) => r.status === "active").length,
        };
      })
      .sort((a, b) => b.resellers.length - a.resellers.length || a.parentName.localeCompare(b.parentName));
  }, [resellers, agents]);

  const term = q.trim().toLowerCase();
  const visibleGroups = useMemo(() => {
    if (!term) return groups;
    return groups
      .map((g) => {
        const parentMatch = g.parentName.toLowerCase().includes(term);
        const filtered = parentMatch ? g.resellers : g.resellers.filter((r) => r.name.toLowerCase().includes(term));
        return { ...g, resellers: filtered };
      })
      .filter((g) => g.resellers.length > 0);
  }, [groups, term]);

  const aktif = resellers.filter((r) => r.status === "active").length;
  const allCollapsed = groups.length > 0 && groups.every((g) => collapsed.has(g.parentId));
  const toggle = (id: string) => setCollapsed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setCollapsed(allCollapsed ? new Set() : new Set(groups.map((g) => g.parentId)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reseller"
        subtitle="Pantau seluruh akun reseller — dikelompokkan per agen pembina. Tampilan read-only untuk monitoring."
      />

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={<Store size={16} />} label="Total Reseller" value={`${resellers.length}`} tone="brand" />
          <Stat icon={<CheckCircle2 size={16} />} label="Reseller Aktif" value={`${aktif}`} tone="success" />
          <Stat icon={<Users size={16} />} label="Agen Pembina" value={`${groups.length}`} tone="info" />
        </div>
      )}

      <Card className="border-slate-100 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="text-xs font-medium leading-relaxed text-slate-500">
            Reseller didaftarkan <strong>manual oleh agen pembina</strong> (tanpa form publik). Tiap kartu di bawah adalah satu agen pembina
            beserta jaringan resellernya — klik header untuk buka/tutup.
          </p>
        </div>
      </Card>

      {/* Toolbar: search + buka/tutup semua */}
      {!loading && groups.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-soft">
            <Search size={15} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari reseller atau agen pembina…"
              className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            onClick={toggleAll}
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-soft transition-colors hover:bg-slate-50"
          >
            {allCollapsed ? "Buka semua" : "Tutup semua"}
          </button>
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={5} />
      ) : visibleGroups.length === 0 ? (
        <EmptyState
          icon={<Store size={26} />}
          title={resellers.length === 0 ? "Belum ada reseller" : "Tidak ada hasil"}
          description={resellers.length === 0 ? "Agen pembina belum membuat akun reseller." : "Coba kata kunci pencarian lain."}
        />
      ) : (
        <div className="space-y-4">
          {visibleGroups.map((g) => {
            const isOpen = !!term || !collapsed.has(g.parentId);
            return (
              <Card key={g.parentId} className="overflow-hidden">
                {/* Header agen pembina — klik untuk buka/tutup */}
                <button
                  onClick={() => toggle(g.parentId)}
                  className="flex w-full items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50/60 to-transparent px-5 py-4 text-left transition-colors hover:from-brand-50"
                >
                  <span className="text-slate-300">{isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-brand">
                    <Users size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-base font-black text-slate-900">{g.parentName}</div>
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <MapPinned size={11} /> {g.kabupaten ?? "Tanpa wilayah"}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone="success">{g.aktif} aktif</Badge>
                    <Badge tone="brand">{g.resellers.length} reseller</Badge>
                  </div>
                </button>

                {/* Daftar reseller */}
                {isOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="px-6 py-3">Reseller</th>
                          <th className="px-4 py-3">Kontak</th>
                          <th className="px-4 py-3">Terdaftar</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {g.resellers.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{r.name}</div>
                              <div className="text-[11px] text-slate-400">{r.id}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="space-y-1">
                                {r.phone && <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><Phone size={11} className="text-slate-400" /> {r.phone}</div>}
                                {r.email && <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><Mail size={11} className="text-slate-400" /> {r.email}</div>}
                                {!r.phone && !r.email && <span className="text-xs font-semibold text-slate-300">—</span>}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-medium text-slate-500">{r.createdAt ? r.createdAt.slice(0, 10) : "—"}</td>
                            <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
