"use client";

import { useEffect, useState } from "react";
import { Save, Settings as Cog, CheckCircle2, Building2, Package } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button } from "@/components/ui";

type RekeningInfo = { bank: string; accountNumber: string; accountName: string; notes?: string };
type Settings = {
  approval_threshold: number;
  consignment_limit: number;
  cutoff_date: number;
  region_target: number;
  min_stock: Record<string, number>;
  price_defaults: Record<string, number>;
  rekening: RekeningInfo[];
};

type Product = { id: string; name: string };

const operasionalFields: { key: keyof Pick<Settings, "approval_threshold" | "consignment_limit" | "cutoff_date" | "region_target">; label: string; hint: string; money?: boolean }[] = [
  { key: "approval_threshold", label: "Threshold Persetujuan Order Besar", hint: "Order ≥ nilai ini wajib masuk antrean persetujuan", money: true },
  { key: "consignment_limit",  label: "Batas Stok Konsinyasi / Agen",      hint: "Nilai maksimum stok titipan per agen",           money: true },
  { key: "cutoff_date",        label: "Tanggal Tutup Bulan",                hint: "Hari ke- untuk cut-off setoran (1–28)" },
  { key: "region_target",      label: "Target Wilayah (botol/bln)",         hint: "Default target evaluasi wilayah per bulan" }
];

export default function AdminSettingsPage() {
  const [s, setS]           = useState<Settings | null>(null);
  const [products, setP]    = useState<Product[]>([]);
  const [saved, setSaved]   = useState(false);
  const [busy, setBusy]     = useState(false);

  useEffect(() => {
    api.get<{ settings: Settings }>("/settings").then((r) => r.data && setS(r.data.settings));
    api.get<{ products: Product[] }>("/produk").then((r) => r.data && setP(r.data.products));
  }, []);

  const save = async () => {
    if (!s) return;
    setBusy(true);
    await api.patch("/settings", s);
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!s) return <Card className="p-10 text-center text-sm font-semibold text-slate-400">Memuat…</Card>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Sistem"
        subtitle="Semua nilai konfigurabel — tersimpan tanpa deploy ulang. Hanya Super Admin yang dapat mengubah."
        actions={<Button loading={busy} onClick={save}><Save size={15} /> Simpan Perubahan</Button>}
      />

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={16} /> Konfigurasi tersimpan dan aktif.
        </div>
      )}

      {/* Operasional Thresholds */}
      <Card className="p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Cog size={18} className="text-brand-600" />
          <h3 className="font-display text-lg font-black text-slate-900">Parameter Operasional</h3>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {operasionalFields.map((f) => (
            <label key={f.key} className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{f.label}</span>
              <input
                type="number"
                value={s[f.key] as number}
                onChange={(e) => setS({ ...s, [f.key]: Number(e.target.value) })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-bold text-slate-900 focus:border-brand-400 focus:bg-white focus:outline-none"
              />
              <span className="text-[11px] font-medium text-slate-400">
                {f.hint}{f.money ? ` · ${formatIdr(s[f.key] as number)}` : ""}
              </span>
            </label>
          ))}
        </div>
      </Card>

      {/* Min Stock per Product */}
      <Card className="p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Package size={18} className="text-brand-600" />
          <h3 className="font-display text-lg font-black text-slate-900">Stok Minimum per Produk</h3>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.filter((p) => !p.name.includes("Maklon") || s.min_stock[p.id] !== undefined).map((p) => (
            <label key={p.id} className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate block">{p.name}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={s.min_stock[p.id] ?? 0}
                  onChange={(e) => setS({ ...s, min_stock: { ...s.min_stock, [p.id]: Number(e.target.value) } })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-bold text-slate-900 focus:border-brand-400 focus:bg-white focus:outline-none"
                />
                <span className="shrink-0 text-xs font-medium text-slate-400">pcs</span>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Rekening */}
      <Card className="p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Building2 size={18} className="text-brand-600" />
          <h3 className="font-display text-lg font-black text-slate-900">Rekening Transfer</h3>
          <p className="ml-2 text-xs font-medium text-slate-400">Ditampilkan ke agen sebagai tujuan setoran</p>
        </div>
        <div className="mt-5 space-y-4">
          {s.rekening.map((r, i) => (
            <div key={i} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:grid-cols-4">
              <label className="block space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bank</span>
                <input
                  value={r.bank}
                  onChange={(e) => { const rec = [...s.rekening]; rec[i] = { ...rec[i], bank: e.target.value }; setS({ ...s, rekening: rec }); }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none"
                />
              </label>
              <label className="block space-y-1 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">No. Rekening</span>
                <input
                  value={r.accountNumber}
                  onChange={(e) => { const rec = [...s.rekening]; rec[i] = { ...rec[i], accountNumber: e.target.value }; setS({ ...s, rekening: rec }); }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none"
                />
              </label>
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama Pemilik</span>
                <input
                  value={r.accountName}
                  onChange={(e) => { const rec = [...s.rekening]; rec[i] = { ...rec[i], accountName: e.target.value }; setS({ ...s, rekening: rec }); }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-800 focus:border-brand-400 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button loading={busy} onClick={save}><Save size={15} /> Simpan Semua Perubahan</Button>
      </div>
    </div>
  );
}
