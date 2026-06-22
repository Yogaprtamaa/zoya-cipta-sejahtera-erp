"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { FileText, ShoppingCart, Wallet, Users, Pencil, Trash2, Calendar, Clock, Package } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Stat, SkeletonTable, EmptyState, Button, Tabs, Drawer } from "@/components/ui";

type Report = {
  id: string;
  resellerId: string;
  agentId: string;
  qty: number;
  value: number;
  date: string;
  period: string;
  notes?: string;
  proofUrl?: string | null;
  createdAt: string;
  productName: string;
  resellerName: string;
  agentName: string;
};

const TABS = ["Tabel Laporan", "Aktivitas Harian"];

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminLaporanResellerPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [agen, setAgen] = useState("all");
  const [tab, setTab] = useState(TABS[0]);

  // edit/delete state
  const [editing, setEditing] = useState<Report | null>(null);
  const [form, setForm] = useState({ qty: 0, date: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return api.get<{ reports: Report[] }>("/laporan-reseller").then((r) => {
      if (r.data) setReports(r.data.reports);
      setLoading(false);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const agenOptions = useMemo(() => {
    const map = new Map<string, string>();
    reports.forEach((r) => map.set(r.agentId, r.agentName));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [reports]);

  const filtered = agen === "all" ? reports : reports.filter((r) => r.agentId === agen);
  const totalQty = filtered.reduce((s, r) => s + r.qty, 0);
  const totalValue = filtered.reduce((s, r) => s + r.value, 0);
  const resellerCount = new Set(filtered.map((r) => r.resellerId)).size;

  // daily activity feed — grouped by submission day
  const days = useMemo(() => {
    const map = new Map<string, Report[]>();
    [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).forEach((r) => {
      const key = r.createdAt.slice(0, 10);
      (map.get(key) ?? map.set(key, []).get(key)!).push(r);
    });
    return Array.from(map, ([key, items]) => ({ key, items }));
  }, [filtered]);

  const openEdit = (r: Report) => {
    setEditing(r);
    setForm({ qty: r.qty, date: r.date, notes: r.notes ?? "" });
    setEditError(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setEditError(null);
    const res = await api.patch("/laporan-reseller", { id: editing.id, qty: form.qty, date: form.date, notes: form.notes });
    setSaving(false);
    if (res.error) { setEditError(res.error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    await api.delete(`/laporan-reseller?id=${id}`);
    setDeleteId(null);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Reseller"
        subtitle="Pantau, koreksi, atau hapus laporan penjualan reseller — lintas agen & wilayah."
      />

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat icon={<FileText size={16} />} label="Total Laporan" value={`${filtered.length}`} tone="brand" />
          <Stat icon={<Users size={16} />} label="Reseller Melapor" value={`${resellerCount}`} tone="info" />
          <Stat icon={<ShoppingCart size={16} />} label="Total Unit" value={`${totalQty} pcs`} tone="warning" />
          <Stat icon={<Wallet size={16} />} label="Total Nilai" value={formatIdr(totalValue)} tone="success" />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        {!loading && agenOptions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Agen Pembina</span>
            <select value={agen} onChange={(e) => setAgen(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-brand-400 focus:outline-none cursor-pointer">
              <option value="all">Semua Agen</option>
              {agenOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FileText size={26} />} title="Belum ada laporan reseller" description="Laporan akan muncul saat reseller mengirim laporan penjualan ke agen pembinanya." />
      ) : tab === TABS[0] ? (
        /* ─── Tabel Laporan ─── */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">No.</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Reseller</th>
                  <th className="px-4 py-3">Agen Pembina</th>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Nilai</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{r.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-500">{r.date}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{r.resellerName}</td>
                    <td className="px-4 py-4 font-medium text-slate-600">{r.agentName}</td>
                    <td className="px-4 py-4 font-medium text-slate-600">{r.productName}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-700">{r.qty} pcs</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-800">{formatIdr(r.value)}</td>
                    <td className="px-6 py-4">
                      {deleteId === r.id ? (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setDeleteId(null)}>Batal</Button>
                          <Button size="sm" variant="danger" onClick={() => remove(r.id)}>Hapus?</Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil size={13} /></Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteId(r.id)}><Trash2 size={13} className="text-rose-500" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={5} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Total</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">{totalQty} pcs</td>
                  <td className="px-4 py-3 text-right font-black text-brand-700">{formatIdr(totalValue)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      ) : (
        /* ─── Aktivitas Harian ─── */
        <div className="space-y-5">
          {days.map(({ key, items }) => {
            const dayQty = items.reduce((s, r) => s + r.qty, 0);
            const dayValue = items.reduce((s, r) => s + r.value, 0);
            return (
              <div key={key}>
                <div className="mb-2.5 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Calendar size={15} /></span>
                  <div className="flex-1">
                    <div className="font-display text-sm font-black text-slate-900">{formatDay(key)}</div>
                    <div className="text-[11px] font-semibold text-slate-400">{items.length} laporan · {dayQty} pcs · {formatIdr(dayValue)}</div>
                  </div>
                </div>
                <Card className="divide-y divide-slate-50 overflow-hidden">
                  {items.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><Package size={16} /></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800">
                          {r.resellerName} <span className="font-medium text-slate-400">melaporkan</span> {r.qty} pcs {r.productName}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-medium text-slate-400">
                          <span className="inline-flex items-center gap-1"><Clock size={10} /> {formatTime(r.createdAt)}</span>
                          <span>· ke {r.agentName}</span>
                          {r.notes && <span className="truncate">· {r.notes}</span>}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-bold text-slate-800">{formatIdr(r.value)}</div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit drawer */}
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={`Koreksi Laporan — ${editing?.id ?? ""}`}>
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-500">
            <div><span className="font-bold text-slate-700">{editing?.resellerName}</span> → {editing?.agentName}</div>
            <div className="mt-0.5">{editing?.productName}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jumlah (pcs)</span>
              <input type="number" min={1} value={form.qty} onChange={(e) => setForm((f) => ({ ...f, qty: Math.max(1, Number(e.target.value)) }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:border-brand-400 focus:outline-none" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tanggal</span>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Catatan</span>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <p className="text-[11px] font-medium text-slate-400">Mengubah jumlah akan menyesuaikan stok konsinyasi reseller secara otomatis.</p>
          {editError && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{editError}</div>}
          <div className="pt-4 border-t border-slate-100">
            <Button className="w-full" loading={saving} onClick={saveEdit}>Simpan Koreksi</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
