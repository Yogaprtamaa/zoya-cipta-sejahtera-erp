"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus, FileText, Users, ShoppingCart, Wallet, Info, CheckCircle2,
  Upload, X, Image as ImageIcon, Boxes,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { DEMO_AGENT_ID, DEMO_RESELLER_ID } from "@/lib/demo";
import { getClientLevel } from "@/lib/auth-mock";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Stat, Button, SkeletonTable, EmptyState, Drawer } from "@/components/ui";

type Report = {
  id: string;
  resellerId: string;
  agentId: string;
  variantId: string;
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
type VariantOpt = { id: string; name: string; price: number | null; productName: string; stock: number };
type StockItem = { variantId: string; productName: string; variantName: string; qty: number };
type ResellerStock = { id: string; name: string; items: StockItem[]; stockQty: number; soldQty: number; soldValue: number; reportCount: number };

export default function LaporanResellerPage() {
  const [level, setLevel] = useState("agen");
  const [reports, setReports] = useState<Report[]>([]);
  const [variants, setVariants] = useState<VariantOpt[]>([]);
  const [resellerStock, setResellerStock] = useState<ResellerStock[]>([]);
  const [loading, setLoading] = useState(true);

  // form state (reseller mode)
  const [open, setOpen] = useState(false);
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(5);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isReseller = level === "reseller";

  const load = useCallback((lvl: string) => {
    setLoading(true);
    const query = lvl === "reseller" ? `resellerId=${DEMO_RESELLER_ID}` : `agentId=${DEMO_AGENT_ID}`;
    api.get<{ reports: Report[] }>(`/laporan-reseller?${query}`).then((r) => {
      if (r.data) setReports(r.data.reports);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const lvl = getClientLevel();
    setLevel(lvl);
    load(lvl);
    if (lvl === "reseller") {
      Promise.all([
        api.get<{ items: { variantId: string; qty: number; variantName?: string; productName?: string }[] }>(`/inventory?locationType=agent&locationId=${DEMO_RESELLER_ID}`),
        api.get<{ products: { variants: { id: string; price: number | null }[] }[] }>("/produk?role=agent&level=reseller"),
      ]).then(([invRes, prodRes]) => {
        const priceMap = new Map<string, number | null>();
        prodRes.data?.products.forEach((p) => p.variants.forEach((v) => priceMap.set(v.id, v.price)));
        const opts = (invRes.data?.items ?? []).map((i) => ({
          id: i.variantId,
          name: i.variantName ?? "",
          productName: i.productName ?? "",
          price: priceMap.get(i.variantId) ?? null,
          stock: i.qty,
        }));
        setVariants(opts);
        if (opts[0]) setVariantId(opts[0].id);
      });
    } else {
      api.get<{ groups: { agentId: string; resellers: ResellerStock[] }[] }>("/stok-reseller").then((r) => {
        const group = r.data?.groups.find((g) => g.agentId === DEMO_AGENT_ID);
        setResellerStock(group?.resellers ?? []);
      });
    }
  }, [load]);

  const selected = variants.find((v) => v.id === variantId);
  const maxStock = selected?.stock ?? 0;
  const estValue = selected?.price != null ? selected.price * qty : null;
  const totalStock = variants.reduce((s, v) => s + v.stock, 0);
  const totalResellerStock = resellerStock.reduce((s, r) => s + r.stockQty, 0);

  const totalQty = reports.reduce((s, r) => s + r.qty, 0);
  const totalValue = reports.reduce((s, r) => s + r.value, 0);
  const agenPembina = reports[0]?.agentName;

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProofFile(f);
    setProofPreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    setQty(5);
    setDate(new Date().toISOString().slice(0, 10));
    setNotes("");
    setProofFile(null);
    setProofPreview(null);
    setError(null);
  };

  const submit = async () => {
    setError(null);
    setBusy(true);
    const res = await api.post("/laporan-reseller", {
      resellerId: DEMO_RESELLER_ID,
      variantId,
      qty,
      date,
      notes: notes.trim() || undefined,
      proofUrl: proofFile ? `mock://bukti-${proofFile.name}` : null,
    });
    setBusy(false);
    if (res.error) { setError(res.error.message); return; }
    setOpen(false);
    resetForm();
    load(level);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Reseller"
        subtitle={isReseller
          ? "Laporkan penjualan Anda ke agen pembina. Laporan diterima agen dan dipantau super admin."
          : "Pantau laporan penjualan dari reseller binaan Anda."}
        actions={isReseller ? (
          <Button onClick={() => { resetForm(); setOpen(true); }}><Plus size={16} /> Input Laporan</Button>
        ) : undefined}
      />

      {/* Summary */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-4">
          {isReseller
            ? <Stat icon={<Boxes size={16} />} label="Stok Belum Terjual" value={`${totalStock} pcs`} tone="warning" />
            : <Stat icon={<Boxes size={16} />} label="Stok Reseller (belum terjual)" value={`${totalResellerStock} pcs`} tone="warning" />}
          <Stat icon={<FileText size={16} />} label="Total Laporan" value={`${reports.length}`} tone="brand" />
          <Stat icon={<ShoppingCart size={16} />} label="Total Unit Terjual" value={`${totalQty} pcs`} tone="info" />
          <Stat icon={<Wallet size={16} />} label="Total Nilai" value={formatIdr(totalValue)} tone="success" />
        </div>
      )}

      {/* Stok Saya (reseller) */}
      {!loading && isReseller && variants.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Boxes size={16} className="text-slate-400" />
            <h3 className="font-display text-sm font-black text-slate-900">Stok Konsinyasi Saya</h3>
            <span className="text-[11px] font-semibold text-slate-400">— sisa yang belum terjual</span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-700">{v.productName}</div>
                  <div className="text-[11px] font-medium text-slate-400">{v.name}</div>
                </div>
                <div className={`shrink-0 font-display text-lg font-black ${v.stock === 0 ? "text-rose-500" : "text-slate-900"}`}>{v.stock}<span className="ml-1 text-[10px] font-bold text-slate-400">pcs</span></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Stok Reseller Binaan (agen) */}
      {!loading && !isReseller && resellerStock.length > 0 && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
            <Boxes size={16} className="text-slate-400" />
            <h3 className="font-display text-sm font-black text-slate-900">Stok Reseller Binaan</h3>
            <span className="text-[11px] font-semibold text-slate-400">— sisa stok yang belum terjual per reseller</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3">Reseller</th>
                  <th className="px-4 py-3">Rincian Stok</th>
                  <th className="px-4 py-3 text-right">Belum Terjual</th>
                  <th className="px-5 py-3 text-right">Terjual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {resellerStock.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{r.name}</td>
                    <td className="px-4 py-3.5">
                      {r.items.length === 0 ? (
                        <span className="text-xs font-semibold text-slate-300">— tidak ada stok</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {r.items.map((i) => (
                            <span key={i.variantId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${i.qty === 0 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}`}>
                              {i.productName} {i.variantName}: <span className="font-black">{i.qty}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right font-black text-amber-600">{r.stockQty} pcs</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-700">{r.soldQty} pcs</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={2} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Total</td>
                  <td className="px-4 py-3 text-right font-black text-amber-600">{totalResellerStock} pcs</td>
                  <td className="px-5 py-3 text-right font-black text-slate-900">{resellerStock.reduce((s, r) => s + r.soldQty, 0)} pcs</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* Context strip */}
      {!loading && (
        <Card className="border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start gap-2.5">
            <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
            <p className="text-xs font-medium leading-relaxed text-slate-500">
              {isReseller ? (
                <>Laporan ini dikirim ke agen pembina Anda{agenPembina ? <strong> {agenPembina}</strong> : null} dan ikut dipantau super admin secara real-time. Nilai dihitung otomatis dari harga tier reseller.</>
              ) : (
                <>Daftar laporan penjualan dari reseller binaan Anda. Tampilan ini bersifat <strong>read-only</strong> — sama seperti yang dipantau super admin.</>
              )}
            </p>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6"><SkeletonTable rows={4} /></div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={isReseller ? <FileText size={26} /> : <Users size={26} />}
            title={isReseller ? "Belum ada laporan" : "Belum ada laporan reseller"}
            description={isReseller ? "Laporkan penjualan Anda agar tercatat oleh agen pembina." : "Reseller binaan Anda belum mengirim laporan penjualan."}
            action={isReseller ? <Button onClick={() => { resetForm(); setOpen(true); }}>Input Laporan Pertama</Button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">No.</th>
                  <th className="px-4 py-3">Tanggal</th>
                  {!isReseller && <th className="px-4 py-3">Reseller</th>}
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Nilai</th>
                  <th className="px-4 py-3">Catatan</th>
                  <th className="px-6 py-3">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">{r.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-500">{r.date}</td>
                    {!isReseller && <td className="px-4 py-4 font-semibold text-slate-700">{r.resellerName}</td>}
                    <td className="px-4 py-4 font-medium text-slate-600">{r.productName}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-700">{r.qty} pcs</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-800">{formatIdr(r.value)}</td>
                    <td className="px-4 py-4 max-w-[220px] truncate text-slate-500">{r.notes ?? "—"}</td>
                    <td className="px-6 py-4">
                      {r.proofUrl ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><CheckCircle2 size={11} /> Ada</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={isReseller ? 4 : 5} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Total</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">{totalQty} pcs</td>
                  <td className="px-4 py-3 text-right font-black text-brand-700">{formatIdr(totalValue)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {/* Submit drawer (reseller only) */}
      <Drawer open={open} onClose={() => setOpen(false)} title="Input Laporan Penjualan">
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Produk Terjual <span className="text-rose-500">*</span></span>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none cursor-pointer">
              {variants.map((v) => <option key={v.id} value={v.id} disabled={v.stock === 0}>{v.productName} · {v.name} — sisa {v.stock} pcs{v.price != null ? ` · ${formatIdr(v.price)}` : ""}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jumlah (pcs) <span className="text-rose-500">*</span></span>
              <input type="number" min={1} max={maxStock} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-900 focus:border-brand-400 focus:outline-none" />
              <span className="text-[10px] font-semibold text-slate-400">Maks {maxStock} pcs (sisa stok Anda)</span>
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tanggal</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none" />
            </label>
          </div>
          {estValue != null && (
            <div className="flex items-center justify-between rounded-xl border border-brand-200/50 bg-brand-50/40 px-4 py-3">
              <span className="text-xs font-bold text-brand-700">Estimasi nilai laporan</span>
              <span className="font-display text-base font-black text-brand-700">{formatIdr(estValue)}</span>
            </div>
          )}
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Catatan</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="cth. Penjualan bazar, repeat order, dll." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-400 focus:outline-none" />
          </label>
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Foto Bukti (opsional)</span>
            {proofPreview ? (
              <div className="relative">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img src={proofPreview} alt="Bukti" className="max-h-44 w-full object-contain p-2" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-600"><ImageIcon size={10} /> {proofFile?.name}</div>
                </div>
                <button onClick={() => { setProofFile(null); setProofPreview(null); }} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 cursor-pointer" aria-label="Hapus foto"><X size={14} /></button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-6 text-center transition-all hover:border-brand-300 hover:bg-brand-50/30">
                <Upload size={20} className="text-slate-300" />
                <span className="text-xs font-bold text-slate-500">Klik untuk pilih foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleProofChange} />
              </label>
            )}
          </div>
          {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div>}
          <div className="pt-4 border-t border-slate-100">
            <Button className="w-full" loading={busy} disabled={!variantId || qty <= 0 || qty > maxStock} onClick={submit}>Kirim Laporan</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
