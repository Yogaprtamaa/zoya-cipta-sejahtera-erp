"use client";

import { useEffect, useState, useCallback } from "react";
import { UserPlus, Store, CheckCircle2, Info, Phone, Mail } from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID } from "@/lib/demo";
import { PageHeader, Card, Stat, Button, StatusBadge, SkeletonTable, EmptyState, Drawer } from "@/components/ui";

type Agent = {
  id: string;
  name: string;
  level: string;
  parentId: string | null;
  status: string;
  email?: string;
  phone?: string;
  createdAt?: string;
};

export default function ResellerBinaanPage() {
  const [resellers, setResellers] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return api.get<{ agents: Agent[] }>("/agen").then((r) => {
      if (r.data) setResellers(r.data.agents.filter((a) => a.level === "reseller" && a.parentId === DEMO_AGENT_ID));
      setLoading(false);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const create = async () => {
    setError(null);
    if (!form.name.trim()) { setError("Nama reseller wajib diisi."); return; }
    setSaving(true);
    const res = await api.post("/agen", {
      name: form.name.trim(),
      level: "reseller",
      parentId: DEMO_AGENT_ID,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
    });
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    setOpen(false);
    setForm({ name: "", email: "", phone: "" });
    load();
  };

  const aktif = resellers.filter((r) => r.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reseller Binaan"
        subtitle="Buat & kelola akun reseller di bawah binaan Anda. Pendaftaran dilakukan manual oleh agen — tanpa form publik."
        actions={<Button onClick={() => { setError(null); setForm({ name: "", email: "", phone: "" }); setOpen(true); }}><UserPlus size={16} /> Tambah Reseller</Button>}
      />

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={<Store size={16} />} label="Total Reseller" value={`${resellers.length}`} tone="brand" />
          <Stat icon={<CheckCircle2 size={16} />} label="Reseller Aktif" value={`${aktif}`} tone="success" />
          <Stat icon={<UserPlus size={16} />} label="Belum Aktif" value={`${resellers.length - aktif}`} tone="warning" />
        </div>
      )}

      <Card className="border-slate-100 bg-slate-50 p-4">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
          <p className="text-xs font-medium leading-relaxed text-slate-500">
            Akun reseller yang Anda buat langsung <strong>aktif</strong> dan terhubung sebagai binaan Anda. Seluruh data ini juga
            <strong> dipantau super admin</strong> secara real-time untuk keperluan monitoring.
          </p>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={4} /></div>
        ) : resellers.length === 0 ? (
          <EmptyState
            icon={<Store size={26} />}
            title="Belum ada reseller binaan"
            description="Buat akun reseller pertama Anda untuk mulai mendistribusikan produk."
            action={<Button onClick={() => setOpen(true)}>Tambah Reseller Pertama</Button>}
          />
        ) : (
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
                {resellers.map((r) => (
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

      <Drawer open={open} onClose={() => setOpen(false)} title="Tambah Reseller Baru">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama Reseller <span className="text-rose-500">*</span></span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nama toko / mitra reseller" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">WhatsApp</span>
            <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+62 812-xxxx-xxxx" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="reseller@email.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <div className="flex items-start gap-2 rounded-xl border border-brand-200/50 bg-brand-50/40 px-3.5 py-3">
            <Info size={13} className="mt-0.5 shrink-0 text-brand-500" />
            <p className="text-[11px] font-medium leading-relaxed text-brand-700">Akun langsung aktif sebagai binaan Anda dan dipantau super admin.</p>
          </div>
          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}
          <div className="pt-4 border-t border-slate-100">
            <Button className="w-full" loading={saving} disabled={!form.name.trim()} onClick={create}>Buat Akun Reseller</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
