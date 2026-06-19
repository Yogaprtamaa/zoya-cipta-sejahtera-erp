"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPinned, Plus, Pencil, Trash2, UserMinus, X, Check } from "lucide-react";
import { api } from "@/lib/api-client";
import { PageHeader, Card, Button, StatusBadge, ProgressBar, Drawer } from "@/components/ui";

type Region = { id: string; kabupaten: string; agentId: string | null; monthlyTarget: number; omzetBotol: number; status: string; agentName: string | null };
type Agent = { id: string; name: string; regionId: string | null; status: string };

export default function AdminWilayahPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [pick, setPick] = useState<Record<string, string>>({});
  const [editTarget, setEditTarget] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // create drawer
  const [createOpen, setCreateOpen] = useState(false);
  const [newRegion, setNewRegion] = useState({ kabupaten: "", monthlyTarget: "100" });
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    api.get<{ regions: Region[] }>("/wilayah").then((r) => r.data && setRegions(r.data.regions));
    api.get<{ agents: Agent[] }>("/agen").then((r) => r.data && setAgents(r.data.agents.filter((a) => a.status === "active" && !a.regionId)));
  }, []);
  useEffect(() => { load(); }, [load]);

  const assign = async (regionId: string) => { const agentId = pick[regionId]; if (!agentId) return; await api.post("/wilayah", { regionId, agentId }); setPick((p) => { const n = { ...p }; delete n[regionId]; return n; }); load(); };
  const unassign = async (regionId: string) => { await api.patch("/wilayah", { id: regionId, agentId: null }); load(); };
  const saveTarget = async (regionId: string) => { const t = editTarget[regionId]; if (!t) return; await api.patch("/wilayah", { id: regionId, monthlyTarget: Number(t) }); setEditTarget((e) => { const n = { ...e }; delete n[regionId]; return n; }); load(); };
  const deleteRegion = async (id: string) => { await api.delete(`/wilayah?id=${id}`); setDeleteConfirm(null); load(); };
  const createRegion = async () => { if (!newRegion.kabupaten) return; setCreating(true); await api.post("/wilayah", { kabupaten: newRegion.kabupaten, monthlyTarget: Number(newRegion.monthlyTarget) }); setCreating(false); setCreateOpen(false); setNewRegion({ kabupaten: "", monthlyTarget: "100" }); load(); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wilayah"
        subtitle="Assignment wilayah eksklusif & evaluasi target bulanan."
        actions={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={14} /> Tambah Wilayah</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {regions.map((r) => {
          const pct = r.monthlyTarget ? Math.round((r.omzetBotol / r.monthlyTarget) * 100) : 0;
          const editingTarget = editTarget[r.id] !== undefined;
          return (
            <Card key={r.id} className="space-y-3 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><MapPinned size={16} /></span>
                  <div>
                    <div className="font-bold text-slate-900">{r.kabupaten}</div>
                    <div className="text-[11px] text-slate-400">{r.agentName ?? "Belum ada agen"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={r.status} />
                  {deleteConfirm === r.id ? (
                    <div className="flex gap-1 ml-1">
                      <button onClick={() => setDeleteConfirm(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={13} /></button>
                      <button onClick={() => deleteRegion(r.id)} className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 cursor-pointer"><Check size={13} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(r.id)} className="rounded-lg p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer ml-1"><Trash2 size={13} /></button>
                  )}
                </div>
              </div>

              {/* Target edit row */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Target:</span>
                {editingTarget ? (
                  <>
                    <input type="number" value={editTarget[r.id]} onChange={(e) => setEditTarget((s) => ({ ...s, [r.id]: e.target.value }))} className="w-20 rounded-lg border border-brand-300 bg-white px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none" />
                    <span className="text-slate-400">botol</span>
                    <button onClick={() => saveTarget(r.id)} className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold text-white hover:bg-brand-700 cursor-pointer">Simpan</button>
                    <button onClick={() => setEditTarget((s) => { const n = { ...s }; delete n[r.id]; return n; })} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={12} /></button>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-slate-700">{r.monthlyTarget} botol</span>
                    <button onClick={() => setEditTarget((s) => ({ ...s, [r.id]: String(r.monthlyTarget) }))} className="rounded-lg p-0.5 text-slate-300 hover:text-slate-600 cursor-pointer"><Pencil size={12} /></button>
                  </>
                )}
              </div>

              {r.status === "available" ? (
                <div className="flex gap-2">
                  <select value={pick[r.id] ?? ""} onChange={(e) => setPick((p) => ({ ...p, [r.id]: e.target.value }))} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer">
                    <option value="">Pilih agen…</option>
                    {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  <Button size="sm" disabled={!pick[r.id]} onClick={() => assign(r.id)}>Assign</Button>
                </div>
              ) : (
                <>
                  <ProgressBar value={pct} tone={pct >= 100 ? "success" : pct >= 60 ? "brand" : "warning"} />
                  <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                    <span>{r.omzetBotol} botol</span>
                    <button onClick={() => unassign(r.id)} className="flex items-center gap-1 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer font-bold"><UserMinus size={12} /> Lepas agen</button>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      <Drawer open={createOpen} onClose={() => setCreateOpen(false)} title="Tambah Wilayah Baru">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama Wilayah <span className="text-rose-500">*</span></span>
            <input value={newRegion.kabupaten} onChange={(e) => setNewRegion((f) => ({ ...f, kabupaten: e.target.value }))} placeholder="cth. Kota Bekasi" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Bulanan (botol)</span>
            <input type="number" value={newRegion.monthlyTarget} onChange={(e) => setNewRegion((f) => ({ ...f, monthlyTarget: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <div className="pt-4 border-t border-slate-100">
            <Button className="w-full" loading={creating} onClick={createRegion} disabled={!newRegion.kabupaten}>Tambah Wilayah</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
