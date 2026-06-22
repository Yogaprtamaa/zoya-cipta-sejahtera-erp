"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, UserPlus } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button, StatusBadge, SkeletonTable, Drawer } from "@/components/ui";

type Agent = { id: string; name: string; level: string; region: string | null; status: string; outstanding: number };

const LEVELS = ["agen", "reseller"];

export default function AdminAgenPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", level: "agen", email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => api.get<{ agents: Agent[] }>("/agen").then((r) => { if (r.data) setAgents(r.data.agents); setLoading(false); }), []);
  useEffect(() => { load(); }, [load]);

  const decide = async (id: string, status: "active" | "rejected") => { await api.patch("/agen", { id, status }); load(); };

  const create = async () => {
    if (!form.name) return;
    setSaving(true);
    await api.post("/agen", form);
    setSaving(false);
    setOpen(false);
    setForm({ name: "", level: "agen", email: "", phone: "" });
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agen & Approval"
        subtitle="Verifikasi pengajuan & kelola mitra aktif."
        actions={<Button size="sm" onClick={() => setOpen(true)}><UserPlus size={14} /> Tambah Agen</Button>}
      />
      <Card className="overflow-hidden">
        {loading ? <div className="p-6"><SkeletonTable rows={5} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm">
            <thead><tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3">Agen</th><th className="px-4 py-3">Wilayah</th><th className="px-4 py-3">Level</th><th className="px-4 py-3 text-right">Outstanding</th><th className="px-4 py-3">Status</th><th className="px-6 py-3" /></tr></thead>
            <tbody className="divide-y divide-slate-50">{agents.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><Link href={`/admin/agen/${a.id}`} className="font-bold text-slate-900 hover:text-brand-700">{a.name}</Link><div className="text-[11px] text-slate-400">{a.id}</div></td>
                <td className="px-4 py-4 font-medium text-slate-600">{a.region ?? "—"}</td>
                <td className="px-4 py-4 font-medium text-slate-500">{a.level}</td>
                <td className="px-4 py-4 text-right font-bold text-slate-700">{a.outstanding ? formatIdr(a.outstanding) : "—"}</td>
                <td className="px-4 py-4"><StatusBadge status={a.status} /></td>
                <td className="px-6 py-4 text-right">{a.status === "pending" ? (
                  <div className="flex justify-end gap-2"><Button size="sm" variant="secondary" onClick={() => decide(a.id, "rejected")}><XCircle size={14} /></Button><Button size="sm" onClick={() => decide(a.id, "active")}><CheckCircle2 size={14} /> Approve</Button></div>
                ) : <Link href={`/admin/agen/${a.id}`}><Button size="sm" variant="ghost">Detail</Button></Link>}</td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </Card>

      <Drawer open={open} onClose={() => setOpen(false)} title="Tambah Agen Baru">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama <span className="text-rose-500">*</span></span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nama toko / mitra" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Level</span>
            <select value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none cursor-pointer">
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="agen@email.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">WhatsApp</span>
            <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+62 812-xxxx-xxxx" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <div className="pt-4 border-t border-slate-100">
            <Button className="w-full" loading={saving} onClick={create}>Tambah Agen</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
