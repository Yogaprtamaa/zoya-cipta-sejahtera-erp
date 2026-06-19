"use client";

import { useEffect, useState } from "react";
import { Save, Settings as Cog, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatIdr } from "@/lib/format";
import { PageHeader, Card, Button } from "@/components/ui";

type Settings = { director_threshold: number; consignment_limit: number; cutoff_date: number; region_target: number };

const fields: { key: keyof Settings; label: string; hint: string; money?: boolean }[] = [
  { key: "director_threshold", label: "Threshold Approval Direktur", hint: "Order ≥ nilai ini wajib disetujui Direktur", money: true },
  { key: "consignment_limit", label: "Batas Stok Konsinyasi / Agen", hint: "Nilai maksimum stok titipan per agen", money: true },
  { key: "cutoff_date", label: "Tanggal Tutup Bulan", hint: "Hari ke- untuk cut-off setoran" },
  { key: "region_target", label: "Target Wilayah (botol/bln)", hint: "Default target evaluasi wilayah" }
];

export default function AdminSettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get<{ settings: Settings }>("/settings").then((r) => r.data && setS(r.data.settings)); }, []);

  const save = async () => { if (!s) return; setBusy(true); await api.patch("/settings", s); setBusy(false); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  if (!s) return <Card className="p-10 text-center text-sm font-semibold text-slate-400">Memuat…</Card>;

  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" subtitle="Konfigurasi sistem — tersimpan sebagai key-value, bukan hardcode." actions={<Button loading={busy} onClick={save}><Save size={15} /> Simpan</Button>} />
      {saved && <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700"><CheckCircle2 size={16} /> Konfigurasi tersimpan.</div>}
      <Card className="p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4"><Cog size={18} className="text-brand-600" /><h3 className="font-display text-lg font-black text-slate-900">Parameter Operasional</h3></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{f.label}</span>
              <input type="number" value={s[f.key]} onChange={(e) => setS({ ...s, [f.key]: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-bold text-slate-900 focus:border-brand-400 focus:bg-white focus:outline-none" />
              <span className="text-[11px] font-medium text-slate-400">{f.hint}{f.money ? ` · ${formatIdr(s[f.key])}` : ""}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
