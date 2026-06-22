"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, UserCog } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable, Badge } from "@/components/ui";

type Agent = { id: string; name: string; level: string; regionId: string | null; region: string | null; status: string; outstanding: number; email?: string; phone?: string };
type Region = { id: string; kabupaten: string };

const LEVELS = ["agen", "reseller"];
const STATUSES = ["active", "pending", "suspended", "rejected"];

export default function AdminAgenDetail() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Agent>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    Promise.all([
      api.get<{ agents: Agent[] }>("/agen"),
      api.get<{ regions: { id: string; kabupaten: string }[] }>("/wilayah")
    ]).then(([ar, rr]) => {
      if (ar.data) setAgent(ar.data.agents.find((a) => a.id === id) ?? null);
      if (rr.data) setRegions(rr.data.regions);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const startEdit = () => { if (agent) { setForm({ name: agent.name, level: agent.level, regionId: agent.regionId, status: agent.status, email: agent.email ?? "", phone: agent.phone ?? "" }); setEditing(true); } };

  const save = async () => {
    setSaving(true);
    await api.patch("/agen", { id, ...form });
    setSaving(false);
    setEditing(false);
    load();
  };

  if (loading) return <SkeletonTable rows={3} />;
  if (!agent) return <Card className="p-10 text-center text-sm font-semibold text-slate-400">Agen tidak ditemukan.</Card>;

  return (
    <div className="space-y-6">
      <Link href="/admin/agen" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Kembali</Link>
      <PageHeader
        title={agent.name}
        subtitle={`${agent.id} · ${agent.level}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={agent.status} />
            {!editing && <Button size="sm" variant="secondary" onClick={startEdit}><UserCog size={14} /> Edit</Button>}
          </div>
        }
      />

      {editing ? (
        <Card className="p-6 space-y-5">
          <h3 className="font-display text-base font-black text-slate-900">Edit Data Agen</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama</span>
              <input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</span>
              <input type="email" value={form.email ?? ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">WhatsApp</span>
              <input type="tel" value={form.phone ?? ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
            </label>
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Level</span>
              <select value={form.level ?? ""} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none cursor-pointer">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</span>
              <select value={form.status ?? ""} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none cursor-pointer">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Wilayah</span>
              <select value={form.regionId ?? ""} onChange={(e) => setForm((f) => ({ ...f, regionId: e.target.value || null }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none cursor-pointer">
                <option value="">— Tidak ada —</option>
                {regions.map((r) => <option key={r.id} value={r.id}>{r.kabupaten}</option>)}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setEditing(false)}>Batal</Button>
            <Button loading={saving} onClick={save}><Save size={14} /> Simpan</Button>
          </div>
        </Card>
      ) : (
        <Card className="grid gap-4 p-6 sm:grid-cols-2">
          {[
            ["Wilayah", agent.region ?? "—"],
            ["Level", agent.level],
            ["Email", agent.email ?? "—"],
            ["WhatsApp", agent.phone ?? "—"],
            ["Outstanding", agent.outstanding ? formatIdr(agent.outstanding) : "Lunas"],
            ["Status", <StatusBadge key="s" status={agent.status} />]
          ].map(([l, v]) => (
            <div key={String(l)} className="rounded-2xl bg-slate-50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{l}</div>
              <div className="mt-1 font-bold text-slate-800">{v}</div>
            </div>
          ))}
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h3 className="font-display text-base font-black text-slate-900">Tagihan Konsinyasi</h3>
          {agent.outstanding > 0 && <Badge tone="warning">Outstanding {formatIdr(agent.outstanding)}</Badge>}
        </div>
        <div className="px-6 py-8 text-center text-sm font-medium text-slate-400">
          Lihat detail tagihan di halaman <Link href="/admin/finance" className="font-bold text-brand-600 hover:underline">Finance</Link>.
        </div>
      </Card>
    </div>
  );
}
